import { useQuery } from "@tanstack/react-query"
import type { APIError } from "@/hooks/errors"

interface Source {
	id?: string
	provider: string
	user_id?: string
	username: string
	uri?: string
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
	timeout?: number
}

const fetchSSHKeys = async ({
	search,
	limit = 10,
	offset = 0,
	fields,
	advanced,
	timeout = 500,
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

	const response = fetch(`/api/v1/ssh/search?${params.toString()}`)
	const wait = new Promise((resolve) => {
		setTimeout(resolve, timeout)
	})

	return await Promise.all([wait, response])
		.then((v) => Promise.all([v[1], v[1].json()]))
		.then((v) => {
			if (v[0].status !== 200) {
				throw v[1]
			}

			return v[1]
		})
}

interface UseSSHKeysOptions {
	search: string
	limit?: number
	offset?: number
	fields?: string[]
	advanced?: boolean
}

const useSshKeys = ({ search, limit, offset, fields, advanced }: UseSSHKeysOptions) => {
	return useQuery({
		queryKey: ["sshkeys", search, limit, offset, fields, advanced],
		queryFn: () => fetchSSHKeys({ search, limit, offset, fields, advanced }),
		enabled: Boolean(search?.trim()),
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
