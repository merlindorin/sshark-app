import { useQuery } from "@tanstack/react-query"
import type { APIError } from "@/hooks/errors"

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

interface SearchResponse {
	entities: SSHKey[]
	total: number
	limit: number
	offset: number
	duration: number
	query: string
}

interface FetchSSHKeysOptions {
	search: string
	limit?: number
	offset?: number
	fields?: string[]
	advanced?: boolean
}

const fetchSSHKeys = async ({
	search,
	limit = 10,
	offset = 0,
	fields,
	advanced,
}: FetchSSHKeysOptions): Promise<SearchResponse> => {
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

	// No artificial floor on how fast this can return. There used to be a 500ms wait here to
	// keep the spinner from flashing; the search now has a skeleton state that handles that,
	// so the wait only made every search half a second slower than it had to be.
	const response = await fetch(`/api/v1/ssh/search?${params.toString()}`)
	const payload = await response.json()

	if (response.status !== 200) {
		throw payload
	}

	return payload
}

interface UseSSHKeysOptions {
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

const useSshKeys = ({ search, limit, offset, fields, advanced, browseAll = false }: UseSSHKeysOptions) => {
	return useQuery({
		queryKey: ["sshkeys", search, limit, offset, fields, advanced],
		queryFn: () => fetchSSHKeys({ search, limit, offset, fields, advanced }),
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

export { useSshKeys, fetchSSHKeys }
export type { SSHKey, Source, SearchResponse, UseSSHKeysOptions, FetchSSHKeysOptions }
