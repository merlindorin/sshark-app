import { useQuery } from "@tanstack/react-query"

interface SourceSummary {
	id: string
	provider: string
	user_id: string
	username: string
	uri: string
	created_at: string
}

interface SourceListResponse {
	entities: SourceSummary[]
	total: number
}

const fetchSources = async (limit: number): Promise<SourceListResponse> => {
	const res = await fetch(`/api/v1/sources?limit=${limit}`)
	if (!res.ok) {
		throw new Error(`failed to fetch sources: ${res.status}`)
	}
	return res.json()
}

const useSources = (limit = 12) => {
	return useQuery({
		queryKey: ["sources", limit],
		queryFn: () => fetchSources(limit),
		staleTime: 60 * 1000,
	})
}

export { useSources }
export type { SourceSummary, SourceListResponse }
