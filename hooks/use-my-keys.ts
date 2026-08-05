import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Task } from "@/hooks/use-tasks"
import { apiJson, authHeaders } from "@/lib/api-client"

interface KeySource {
	id?: string
	provider?: string
	user_id?: string
	username?: string
	uri?: string
}

interface MyKeyBase {
	id: string
	fingerprint: string
	key_data: string
	algorithm?: string
	key_bits?: number
	/** The key sits under a provider account the user proved they own by signing in with it. */
	verified: boolean
	/** sshark can delete this key at its provider on the user's behalf. */
	revocable: boolean
	created_at: string
	updated_at: string
	source?: KeySource
}

interface MySSHKey extends MyKeyBase {
	comment?: string
}

interface MyGPGKey extends MyKeyBase {
	expires_at?: string
	user_ids?: string[]
	capabilities?: string[]
}

interface ConnectedAccount {
	provider: string
	username: string
	uri?: string
	can_revoke: boolean
	missing_scopes?: string[]
}

interface MyKeysResponse {
	accounts: ConnectedAccount[]
	ssh_keys: MySSHKey[]
	gpg_keys: MyGPGKey[]
	refreshed_at?: string
}

type GetTokenFn = () => Promise<string | null>

const MY_KEYS_QUERY_KEY = ["me", "keys"] as const

const fetchMyKeys = (getToken: GetTokenFn) => {
	return async (): Promise<MyKeysResponse> => {
		const token = await getToken()
		return apiJson<MyKeysResponse>("/api/v1/me/keys", 200, {
			headers: authHeaders(token),
		})
	}
}

const refreshMyKeys = (getToken: GetTokenFn) => {
	return async (): Promise<Task> => {
		const token = await getToken()
		// 202: the work is queued, not done. The response is the task to follow.
		return apiJson<Task>("/api/v1/me/keys/refresh", 202, {
			method: "POST",
			headers: authHeaders(token),
		})
	}
}

const revokeKey = (getToken: GetTokenFn) => {
	return async (id: string): Promise<Task> => {
		const token = await getToken()
		return apiJson<Task>(`/api/v1/me/keys/${id}`, 202, {
			method: "DELETE",
			headers: authHeaders(token),
		})
	}
}

const useMyKeys = () => {
	const { getToken } = useAuth()

	return useQuery({
		queryKey: MY_KEYS_QUERY_KEY,
		queryFn: fetchMyKeys(getToken),
		placeholderData: (prev) => prev,
		staleTime: 60 * 1000,
	})
}

/**
 * Queues a refresh of every connected provider and returns the task to watch. The keys query is
 * refetched by the caller once that task settles, not here, because nothing has changed yet.
 */
const useRefreshMyKeys = () => {
	const { getToken } = useAuth()

	return useMutation({
		mutationFn: refreshMyKeys(getToken),
	})
}

/** Queues the deletion of a key at its provider, returning the task to watch. */
const useRevokeKey = () => {
	const { getToken } = useAuth()

	return useMutation({
		mutationFn: revokeKey(getToken),
	})
}

/** Refetches the key list, for once a task that changed it has settled. */
const useReloadMyKeys = () => {
	const queryClient = useQueryClient()

	return () => queryClient.invalidateQueries({ queryKey: MY_KEYS_QUERY_KEY })
}

export { useMyKeys, useReloadMyKeys, useRefreshMyKeys, useRevokeKey }
export type { ConnectedAccount, KeySource, MyGPGKey, MyKeysResponse, MySSHKey }
