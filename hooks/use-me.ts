import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiJson, apiVoid, authHeaders } from "@/lib/api-client"

interface Me {
	id: string
	email?: string
	first_name?: string
	last_name?: string
	/** The SSHark username the public profile is served from. */
	username?: string
	profile_url: string
	image_url?: string
	created_at: number
}

interface UsernameAvailability {
	username: string
	available: boolean
	reason?: string
}

interface MyProfile {
	username: string
	profile_url: string
}

type GetTokenFn = () => Promise<string | null>

const ME_QUERY_KEY = ["me"] as const

const fetchMe = (getToken: GetTokenFn) => {
	return async (): Promise<Me> => {
		const token = await getToken()
		return apiJson<Me>("/api/v1/me", 200, {
			headers: authHeaders(token),
		})
	}
}

const checkUsername = (getToken: GetTokenFn) => {
	return async (username: string): Promise<UsernameAvailability> => {
		const token = await getToken()
		const params = new URLSearchParams({ username })
		return apiJson<UsernameAvailability>(`/api/v1/me/username/available?${params.toString()}`, 200, {
			headers: authHeaders(token),
		})
	}
}

const setUsername = (getToken: GetTokenFn) => {
	return async (username: string): Promise<MyProfile> => {
		const token = await getToken()
		return apiJson<MyProfile>("/api/v1/me/username", 200, {
			method: "PUT",
			headers: authHeaders(token, { "Content-Type": "application/json" }),
			body: JSON.stringify({ username }),
		})
	}
}

const deleteProfile = (getToken: GetTokenFn) => {
	return async (): Promise<void> => {
		const token = await getToken()
		await apiVoid("/api/v1/me/profile", 204, {
			method: "DELETE",
			headers: authHeaders(token),
		})
	}
}

/**
 * The signed-in user's SSHark account. Asking for it is also what creates the profile on first
 * visit, defaulting the username to the first connected provider login.
 */
const useMe = () => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: ME_QUERY_KEY,
		queryFn: fetchMe(getToken),
		placeholderData: (prev) => prev,
		staleTime: 60 * 1000,
	})
}

const useCheckUsername = () => {
	const { getToken } = useAuth()

	return useMutation({
		mutationFn: checkUsername(getToken),
	})
}

const useSetUsername = () => {
	const { getToken } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: setUsername(getToken),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
		},
	})
}

/**
 * Releases the SSHark profile so the username is free again. The account itself lives in
 * Clerk, which knows nothing about this table, so deleting one without the other would strand
 * the username on a profile nobody can sign in to.
 */
const useDeleteProfile = () => {
	const { getToken } = useAuth()

	return useMutation({
		mutationFn: deleteProfile(getToken),
	})
}

export { useCheckUsername, useDeleteProfile, useMe, useSetUsername, fetchMe }
export type { Me, MyProfile, UsernameAvailability }
