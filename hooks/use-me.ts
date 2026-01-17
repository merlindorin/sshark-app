import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"

interface Me {
	total_keys: number
	total_usernames: number
	total_providers: number
}

type GetTokenFn = () => Promise<string | null>

const fetchMe = (getToken: GetTokenFn) => {
	return async (): Promise<Me> => {
		const token = await getToken()
		const response = await fetch("/api/v1/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.status !== 200) {
			throw await response.json()
		}

		return response.json()
	}
}

const useMe = () => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: ["me"],
		queryFn: fetchMe(getToken),
		placeholderData: (prev) => prev,
		staleTime: 60 * 1000,
	})
}

export { useMe, fetchMe }
