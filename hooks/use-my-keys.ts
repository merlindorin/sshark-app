import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
		const response = await fetch("/api/v1/me/keys", {
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

const refreshMyKeys = (getToken: GetTokenFn) => {
	return async (): Promise<MyKeysResponse> => {
		const token = await getToken()
		const response = await fetch("/api/v1/me/keys/refresh", {
			method: "POST",
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

const revokeKey = (getToken: GetTokenFn) => {
	return async (id: string): Promise<void> => {
		const token = await getToken()
		const response = await fetch(`/api/v1/me/keys/${id}`, {
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
 * Pulls the current keys from every connected provider before returning them, so a key added
 * at the provider a moment ago shows up without waiting for the background crawler.
 */
const useRefreshMyKeys = () => {
	const { getToken } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: refreshMyKeys(getToken),
		onSuccess: (data) => {
			queryClient.setQueryData(MY_KEYS_QUERY_KEY, data)
		},
	})
}

/** Deletes the key at its provider, then drops it from sshark. */
const useRevokeKey = () => {
	const { getToken } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: revokeKey(getToken),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MY_KEYS_QUERY_KEY })
		},
	})
}

export { useMyKeys, useRefreshMyKeys, useRevokeKey }
export type { ConnectedAccount, KeySource, MyGPGKey, MyKeysResponse, MySSHKey }
