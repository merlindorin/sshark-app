import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface ApiKey {
	object: "api_key"
	id: string
	type: "api_key"
	subject: string
	name: string
	description?: string
	claims?: Record<string, unknown>
	scopes?: string[]
	revoked: boolean
	revocation_reason?: string
	expired: boolean
	expiration?: number
	created_by: string
	last_used_at?: number
	created_at: number
	updated_at: number
}

interface ApiKeyWithSecret extends ApiKey {
	secret: string
}

interface ApiKeysResponse {
	api_keys: ApiKey[]
}

interface CreateApiKeyRequest {
	name: string
	description?: string
	claims?: Record<string, unknown>
	scopes?: string[]
	expiration?: number
}

type GetTokenFn = () => Promise<string | null>

const fetchApiKeys = (getToken: GetTokenFn) => {
	return async (): Promise<ApiKeysResponse> => {
		const token = await getToken()
		const response = await fetch("/api/v1/me/apikeys", {
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

const createApiKey = (getToken: GetTokenFn) => {
	return async (request: CreateApiKeyRequest): Promise<ApiKeyWithSecret> => {
		const token = await getToken()
		const response = await fetch("/api/v1/me/apikeys", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		})

		if (response.status !== 201) {
			throw await response.json()
		}

		return response.json()
	}
}

const deleteApiKey = (getToken: GetTokenFn) => {
	return async (id: string): Promise<void> => {
		const token = await getToken()
		const response = await fetch(`/api/v1/me/apikeys/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.status !== 204) {
			throw await response.json()
		}
	}
}

const useApiKeys = () => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: ["apikeys"],
		queryFn: fetchApiKeys(getToken),
		placeholderData: (prev) => prev,
		staleTime: 60 * 1000,
	})
}

const useCreateApiKey = () => {
	const { getToken } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createApiKey(getToken),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apikeys"] })
		},
	})
}

const useDeleteApiKey = () => {
	const { getToken } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteApiKey(getToken),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apikeys"] })
		},
	})
}

export { useApiKeys, useCreateApiKey, useDeleteApiKey }
export type { ApiKey, ApiKeyWithSecret, CreateApiKeyRequest, ApiKeysResponse }
