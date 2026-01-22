import { useQuery } from "@tanstack/react-query"
import type { APIError } from "@/hooks/errors"

interface SSHKey {
	id: string
	username: string
	source: string
	provider: string
	key: string
	options: string[]
	comment: string
	type: string
	updated_at: string
}

type SearchResultItem = SSHKey[]

interface SearchResponse {
	entities: SearchResultItem
	total: number
	limit: number
	offset: number
	duration: number
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
	const params = new URLSearchParams({
		query: search,
		limit: limit.toString(),
		offset: (offset * limit).toString(),
	})

	if (fields && fields.length > 0) {
		params.append("fields", fields.join(","))
	}

	if (advanced !== undefined) {
		params.append("advanced", advanced.toString())
	}

	const response = fetch(`/api/v1/search?${params.toString()}`)
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
export type { SSHKey, SearchResultItem, SearchResponse, UseSSHKeysOptions, FetchSSHKeysOptions }
