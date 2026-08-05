import type { APIError } from "@/hooks/errors"

/**
 * An API call that did not return what the caller expected. It carries the status so callers
 * can tell "your session lapsed" from "the server broke", and a message safe to show a user.
 */
export class ApiRequestError extends Error {
	readonly status: number
	readonly payload?: APIError

	constructor(status: number, message: string, payload?: APIError) {
		super(message)
		this.name = "ApiRequestError"
		this.status = status
		this.payload = payload
	}
}

/**
 * Messages for the statuses that arrive with no body at all. Clerk's auth middleware rejects a
 * token with a bare 403 and zero bytes, and proxies do the same for 502/504 — parsing those as
 * JSON is what produced "JSON.parse: unexpected end of data" instead of anything useful.
 */
const STATUS_MESSAGES: Record<number, string> = {
	401: "Your session has expired. Sign in again and retry.",
	403: "Your session was rejected. Sign in again and retry.",
	404: "Not found.",
	409: "That conflicts with something that already exists.",
	429: "Too many requests. Wait a moment and retry.",
	500: "Something went wrong on our side.",
	502: "Could not reach the SSHark API.",
	503: "The SSHark API is unavailable.",
	504: "The SSHark API took too long to respond.",
}

function messageFor(status: number, payload?: APIError): string {
	if (payload?.error?.message) {
		return payload.error.suggestion ? `${payload.error.message} ${payload.error.suggestion}` : payload.error.message
	}

	return STATUS_MESSAGES[status] ?? `Request failed (${status}).`
}

/**
 * Calls the SSHark API and fails with something legible.
 *
 * The body is read as text first and only parsed when there is something to parse: an error
 * response is not guaranteed to be JSON, and treating an empty one as JSON replaces the real
 * problem with a parser error.
 */
async function requestApi<T>(path: string, expectedStatus: number, init: RequestInit = {}): Promise<T | undefined> {
	let response: Response

	try {
		response = await fetch(path, init)
	} catch {
		throw new ApiRequestError(0, "Could not reach the SSHark API. Check your connection and retry.")
	}

	const raw = await response.text()
	let payload: APIError | undefined
	if (raw.length > 0) {
		try {
			payload = JSON.parse(raw) as APIError
		} catch {
			// A non-JSON body is still useful context, just not structured.
			payload = undefined
		}
	}

	if (response.status !== expectedStatus) {
		throw new ApiRequestError(response.status, messageFor(response.status, payload), payload)
	}

	return payload as T | undefined
}

/** Calls the API expecting a JSON body. */
export async function apiJson<T>(path: string, expectedStatus: number, init: RequestInit = {}): Promise<T> {
	const payload = await requestApi<T>(path, expectedStatus, init)
	if (payload === undefined) {
		throw new ApiRequestError(expectedStatus, "The SSHark API returned an empty response.")
	}

	return payload
}

/** Calls the API expecting no body, such as a 204. */
export async function apiVoid(path: string, expectedStatus: number, init: RequestInit = {}): Promise<void> {
	await requestApi<never>(path, expectedStatus, init)
}

/**
 * Builds the auth header, refusing to send a request that cannot possibly be authorised.
 *
 * Clerk's getToken() resolves to null once the session has lapsed. Interpolating that yields
 * the literal string "Bearer null", which the API rejects with a bare 401 and no body — the
 * user sees a parser error instead of being told to sign in again.
 */
export function authHeaders(token: string | null, extra: Record<string, string> = {}): Record<string, string> {
	if (!token) {
		throw new ApiRequestError(401, "Your session has expired. Sign in again and retry.")
	}

	return { Authorization: `Bearer ${token}`, ...extra }
}

/** Turns anything thrown by these helpers into a message worth showing. */
export function apiErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof ApiRequestError) {
		return error.message
	}
	if (error instanceof Error) {
		return error.message
	}
	return fallback
}
