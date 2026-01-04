import { useQuery } from "@tanstack/react-query"

interface Stats {
	total_keys: number
	total_usernames: number
	total_providers: number
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

export { useStats, fetchStats }
