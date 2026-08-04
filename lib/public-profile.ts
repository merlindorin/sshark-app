import "server-only"

/**
 * SSHark accounts are addressed with a leading @ (/@merlin) to keep them apart from the
 * username pages that list whatever SSHark scraped under a name (/merlin). Next.js hands the
 * whole segment over, @ included.
 */
const PROFILE_PREFIX = "@"

export interface ProfileAccount {
	provider: string
	username: string
	uri?: string
	profile_username?: string
}

export interface ProfileKey {
	id: string
	fingerprint: string
	/** Base64 of the complete key line, exactly as the provider published it. */
	key_data: string
	algorithm?: string
	comment?: string
	key_bits?: number
	expires_at?: string
	user_ids?: string[]
	capabilities?: string[]
	created_at: string
	updated_at: string
	source?: ProfileAccount & { id?: string; user_id?: string }
}

export interface PublicProfile {
	username: string
	display_name?: string
	avatar_url?: string
	created_at: string
	accounts: ProfileAccount[]
	ssh_keys: ProfileKey[]
	gpg_keys: ProfileKey[]
}

/** Returns the claimed username when the route segment addresses an SSHark account. */
export function accountUsernameFrom(segment: string): string | null {
	const decoded = decodeURIComponent(segment)
	if (!decoded.startsWith(PROFILE_PREFIX)) {
		return null
	}

	const username = decoded.slice(PROFILE_PREFIX.length)
	return username.length > 0 ? username : null
}

/**
 * Loads a public profile. Returns null when nobody holds the username, which the caller turns
 * into a 404 rather than an error page.
 */
export async function fetchPublicProfile(username: string): Promise<PublicProfile | null> {
	const apiBaseUrl = process.env.API_URL || "http://localhost:8080"
	const url = `${apiBaseUrl}/api/v1/users/${encodeURIComponent(username)}`

	const res = await fetch(url, {
		next: { revalidate: 300, tags: [`profile:${username.toLowerCase()}`] },
	})

	if (res.status === 404) {
		return null
	}
	if (!res.ok) {
		throw new Error(`upstream ${res.status} fetching ${url}`)
	}

	return (await res.json()) as PublicProfile
}

/**
 * Decodes a key back to the line the provider published. The API base64-encodes the complete
 * line — algorithm, key material and comment — so the algorithm must not be prepended again.
 */
export function decodeKeyData(keyData: string): string {
	return Buffer.from(keyData, "base64").toString("utf8").trim()
}
