/**
 * Helpers to recognise a pasted OpenSSH public key and turn it into a search
 * query. The API indexes fingerprints, not key material, so a plain key is
 * resolved client-side to its `SHA256:...` fingerprint before searching.
 */

/** `<algorithm> <base64 key data> [comment]` */
const PUBLIC_KEY_PATTERN = /^([a-z][\w@.-]*) ([A-Za-z0-9+/]+={0,2})(?: (\S.*))?$/
const WHITESPACE_PATTERN = /\s+/g

/** Longest plausible algorithm name inside a key blob, e.g. "sk-ecdsa-sha2-nistp256@openssh.com". */
const MAX_ALGORITHM_LENGTH = 64
const ALGORITHM_LENGTH_PREFIX = 4
/** Smallest key material we accept after the algorithm name (an ed25519 key carries 36 bytes). */
const MIN_KEY_MATERIAL_LENGTH = 32
const BASE64_PADDING_PATTERN = /=+$/

export interface ParsedPublicKey {
	algorithm: string
	keyData: string
	comment?: string
}

function decodeBase64(value: string): Uint8Array<ArrayBuffer> | null {
	try {
		const binary = atob(value)
		return Uint8Array.from(binary, (char) => char.charCodeAt(0))
	} catch {
		return null
	}
}

function encodeBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes))
}

/**
 * An OpenSSH key blob starts with a length-prefixed copy of its algorithm name.
 * Reading it back is a cheap way to reject text that merely looks like base64.
 */
function readBlobAlgorithm(bytes: Uint8Array): string | null {
	if (bytes.length <= ALGORITHM_LENGTH_PREFIX) {
		return null
	}

	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	const length = view.getUint32(0)
	const minLength = ALGORITHM_LENGTH_PREFIX + length + MIN_KEY_MATERIAL_LENGTH

	if (length === 0 || length > MAX_ALGORITHM_LENGTH || bytes.length < minLength) {
		return null
	}

	return new TextDecoder().decode(bytes.subarray(ALGORITHM_LENGTH_PREFIX, ALGORITHM_LENGTH_PREFIX + length))
}

/**
 * Parses `<algorithm> <base64 key> [comment]`, returning null when the input is
 * not an OpenSSH public key.
 */
export function parsePublicKey(input: string): ParsedPublicKey | null {
	const match = PUBLIC_KEY_PATTERN.exec(input.trim().replace(WHITESPACE_PATTERN, " "))

	if (!match) {
		return null
	}

	const [, algorithm, keyData, comment] = match
	const bytes = decodeBase64(keyData)

	if (!bytes || readBlobAlgorithm(bytes) !== algorithm) {
		return null
	}

	return { algorithm, keyData, comment }
}

/**
 * Computes the OpenSSH `SHA256:...` fingerprint of a base64 key blob. Returns
 * null when Web Crypto is unavailable, e.g. on a page served over plain HTTP.
 */
export async function fingerprintPublicKey(keyData: string): Promise<string | null> {
	const bytes = decodeBase64(keyData)

	if (!(bytes && globalThis.crypto?.subtle)) {
		return null
	}

	const digest = await crypto.subtle.digest("SHA-256", bytes)
	const encoded = encodeBase64(new Uint8Array(digest)).replace(BASE64_PADDING_PATTERN, "")

	return `SHA256:${encoded}`
}

/**
 * Builds an advanced query matching a fingerprint. Base64 slashes are replaced
 * by the `*` wildcard because the query syntax has no way to express them; a
 * false positive would require a second key whose fingerprint differs only at
 * those positions.
 */
export function fingerprintQuery(fingerprint: string): string {
	return `@fingerprint:{${fingerprint.replaceAll("/", "*")}}`
}

export interface ResolvedSearch {
	query: string
	isAdvanced: boolean
	/** Set when the input was a public key that got resolved to its fingerprint. */
	fingerprint?: string
}

/**
 * Turns raw search input into the query to run: a pasted public key becomes an
 * advanced fingerprint lookup, anything else is passed through untouched.
 */
export async function resolveSearchInput(input: string, isAdvanced: boolean): Promise<ResolvedSearch> {
	const parsed = parsePublicKey(input)

	if (!parsed) {
		return { query: input, isAdvanced }
	}

	const fingerprint = await fingerprintPublicKey(parsed.keyData)

	if (!fingerprint) {
		return { query: input, isAdvanced }
	}

	return { query: fingerprintQuery(fingerprint), isAdvanced: true, fingerprint }
}
