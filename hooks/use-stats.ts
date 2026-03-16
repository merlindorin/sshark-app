import { useQuery } from "@tanstack/react-query"

interface FacetValue {
	value: string
	count: number
}

interface Facet {
	type: "value"
	data: FacetValue[]
}

interface Stats {
	facets: Record<string, Facet[]>
}

function getFacetData(stats: Stats | undefined, facetName: string): FacetValue[] {
	if (!stats?.facets?.[facetName]?.[0]?.data) {
		return []
	}
	return stats.facets[facetName][0].data
}

function getFacetTotal(stats: Stats | undefined, facetName: string): number {
	return getFacetData(stats, facetName).reduce((sum, item) => sum + item.count, 0)
}

function getFacetCount(stats: Stats | undefined, facetName: string): number {
	return getFacetData(stats, facetName).length
}

function getFacetValueCount(stats: Stats | undefined, facetName: string, value: string): number {
	const data = getFacetData(stats, facetName)
	const entry = data.find((item) => item.value === value)
	return entry?.count ?? 0
}

const fetchStats = async (): Promise<Stats> => {
	const response = await fetch("/api/v1/stats")

	if (response.status !== 200) {
		throw await response.json()
	}

	return response.json()
}

const useStats = () => {
	return useQuery({
		queryKey: ["stats"],
		queryFn: fetchStats,
		placeholderData: (prev) => prev,
		staleTime: 60 * 1000,
	})
}

export { useStats, fetchStats, getFacetData, getFacetTotal, getFacetCount, getFacetValueCount }
export type { Stats, Facet, FacetValue }
