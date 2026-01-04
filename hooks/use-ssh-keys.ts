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

const fetchSSHKeys = async (search: string, limit = 10, offset = 0, timeout = 500): Promise<SearchResponse> => {
	const response = fetch(`/api/v1/search/${encodeURIComponent(search)}?limit=${limit}&offset=${offset * limit}`)
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

const useSshKeys = (search: string, limit?: number, offset?: number) => {
	return useQuery({
		queryKey: ["sshkeys", search, limit, offset],
		queryFn: () => fetchSSHKeys(search, limit, offset),
		enabled: search.length > 0,
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
export type { SSHKey, SearchResultItem, SearchResponse }
