import { useQuery } from "@tanstack/react-query"
import type { APIError } from "@/hooks/errors"
import type { KeyType } from "@/lib/key-search-config"

interface Source {
	id?: string
	provider: string
	user_id?: string
	username: string
	uri?: string
	/**
	 * Username of the SSHark account that proved it owns this provider account. Absent for the
	 * many indexed sources nobody has claimed.
	 */
	profile_username?: string
}

interface SSHKey {
	id: string
	fingerprint: string
	key_data: string
	algorithm: string
	comment?: string
	key_bits?: number
	created_at: string
	updated_at: string
	source?: Source
}

interface GPGKey {
	id: string
	fingerprint: string
	key_data: string
	algorithm?: string
	key_bits?: number
	expires_at?: string
	user_ids?: string[]
	capabilities?: string[]
	created_at: string
	updated_at: string
	source?: Source
}

type Key = SSHKey | GPGKey

interface SearchResponse<T = Key> {
	entities: T[]
	total: number
	limit: number
	offset: number
	duration: number
	query: string
}

interface FetchKeysOptions {
	keyType: KeyType
	search: string
	limit?: number
	offset?: number
	fields?: string[]
	advanced?: boolean
}

const fetchKeys = async <T extends Key>({
	keyType,
	search,
	limit = 10,
	offset = 0,
	fields,
	advanced,
}: FetchKeysOptions): Promise<SearchResponse<T>> => {
	const params = new URLSearchParams()

	if (advanced) {
		params.set("q", search)
	} else {
		params.set("query", search)
	}

	params.set("limit", limit.toString())
	params.set("offset", (offset * limit).toString())

	if (!advanced && fields && fields.length > 0) {
		params.set("fields", fields.join(","))
	}

	const endpoint = keyType === "ssh" ? "/api/v1/ssh/search" : "/api/v1/gpg/search"
	const response = await fetch(`${endpoint}?${params.toString()}`)
	const payload = await response.json()

	if (response.status !== 200) {
		throw payload
	}

	return payload
}

interface UseKeysOptions {
	keyType: KeyType
	search: string
	limit?: number
	offset?: number
	fields?: string[]
	advanced?: boolean
	/**
	 * Run the search even with an empty term, which the API answers with every key, newest
	 * first. Off by default so a page that is waiting on a username does not accidentally ask
	 * for the whole index.
	 */
	browseAll?: boolean
}

const useKeys = <T extends Key>({
	keyType,
	search,
	limit,
	offset,
	fields,
	advanced,
	browseAll = false,
}: UseKeysOptions) => {
	return useQuery({
		queryKey: ["keys", keyType, search, limit, offset, fields, advanced],
		queryFn: () => fetchKeys<T>({ keyType, search, limit, offset, fields, advanced }),
		enabled: browseAll || Boolean(search?.trim()),
		placeholderData: (prev) => prev,
		retry: (_failureCount, error: APIError | Error): boolean => {
			return !(
				"error" in error &&
				["INVALID_SEARCH_QUERY", "INVALID_PATH_PARAM", "INVALID_QUERY_PARAM"].includes(error?.error?.code)
			)
		},
		staleTime: 5 * 1000,
	})
}

export { useKeys, fetchKeys }
export type { SSHKey, GPGKey, Key, Source, SearchResponse, UseKeysOptions, FetchKeysOptions }
