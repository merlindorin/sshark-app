import { useReverification, useUser } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"

/*
 * Clerk's resource types live in `@clerk/types`, which this app only gets transitively through
 * `@clerk/nextjs`. Deriving them from the hook keeps the import surface to what we actually
 * depend on, and keeps these definitions in step with whatever Clerk version is installed.
 */
type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>
type ExternalAccountResource = ClerkUser["externalAccounts"][number]
type OAuthStrategy = Parameters<ClerkUser["createExternalAccount"]>[0]["strategy"]

/**
 * The providers SSHark indexes keys for. This mirrors the backend's provider list rather than
 * Clerk's enabled connections: a provider Clerk can authenticate but SSHark cannot scrape would
 * be a dead end, and a provider SSHark scrapes but Clerk has not enabled surfaces a clear error
 * when connecting instead of silently disappearing.
 */
interface SupportedProvider {
	provider: string
	strategy: string
	label: string
	/**
	 * Scopes beyond the sign-in grant. Left undefined when none are needed — an empty array is
	 * not the same thing to Clerk, which forwards the value into the provider's authorize URL.
	 */
	additionalScopes?: readonly string[]
}

const SUPPORTED_PROVIDERS: readonly SupportedProvider[] = [
	{
		provider: "github",
		strategy: "oauth_github",
		label: "GitHub",
		/**
		 * Requested up front so revoking a key works right after connecting, instead of sending
		 * the user back through a second consent screen the first time they try.
		 */
		additionalScopes: ["admin:public_key", "admin:gpg_key"],
	},
	{
		provider: "gitlab",
		strategy: "oauth_gitlab",
		label: "GitLab",
		// SShark reads GitLab keys from the public API and cannot revoke them, so the default
		// grant is enough and no additional scope is requested.
	},
]

interface ConnectedAccount {
	id: string
	provider: string
	label: string
	username?: string
	emailAddress: string
	imageUrl: string
	/** Clerk finished the OAuth handshake. Unverified accounts are failed or abandoned attempts. */
	verified: boolean
	verificationError?: string
	approvedScopes: string
	/**
	 * Scopes SSHark needs but this connection was never granted. Signing in with a provider
	 * creates the connection with only the scopes the sign-in flow asks for, so an account can
	 * arrive here connected but unable to manage keys.
	 */
	missingScopes: string[]
	/** The account cannot be disconnected because it is the only way left to sign in. */
	isLastSignInMethod: boolean
	resource: ExternalAccountResource
}

function providerFor(provider: string): SupportedProvider | undefined {
	return SUPPORTED_PROVIDERS.find((candidate) => candidate.provider === provider)
}

function labelFor(provider: string): string {
	return providerFor(provider)?.label ?? provider
}

/** Providers hand back granted scopes as one string, separated by spaces or commas. */
const SCOPE_SEPARATOR = /[\s,]+/

/**
 * Scopes that are covered by holding a broader one.
 *
 * GitHub nests its scopes: admin:public_key confers write:public_key and read:public_key, and
 * the same for gpg_key. GitHub reports only what was asked for, so comparing the granted list
 * to the required list as plain strings claims a scope is missing when a broader one already
 * grants it.
 */
const SCOPE_IMPLICATIONS: Record<string, readonly string[]> = {
	"admin:public_key": ["write:public_key", "read:public_key"],
	"write:public_key": ["read:public_key"],
	"admin:gpg_key": ["write:gpg_key", "read:gpg_key"],
	"write:gpg_key": ["read:gpg_key"],
}

/** Expands granted scopes to everything they confer. */
function expandScopes(granted: Iterable<string>): Set<string> {
	const expanded = new Set<string>()

	for (const scope of granted) {
		expanded.add(scope)
		for (const implied of SCOPE_IMPLICATIONS[scope] ?? []) {
			expanded.add(implied)
		}
	}

	return expanded
}

function missingScopesFor(provider: string, approvedScopes: string): string[] {
	const required = providerFor(provider)?.additionalScopes ?? []
	const approved = expandScopes(approvedScopes.split(SCOPE_SEPARATOR).filter(Boolean))

	return required.filter((scope) => !approved.has(scope))
}

function clerkErrorMessage(error: unknown, fallback: string): string {
	if (error && typeof error === "object" && "errors" in error) {
		const errors = (error as { errors?: { longMessage?: string; message?: string }[] }).errors
		const first = errors?.[0]
		if (first) {
			return first.longMessage ?? first.message ?? fallback
		}
	}
	if (error instanceof Error) {
		return error.message
	}
	return fallback
}

/**
 * Builds the parameters for linking a provider.
 *
 * additionalScopes is omitted rather than sent as an empty array: Clerk forwards the value into
 * the provider's authorize URL, and an empty `additional_scope` is not the same as asking for
 * nothing extra — GitLab rejects the round trip, which surfaces as "You did not grant access to
 * your account".
 */
function linkParams(candidate: SupportedProvider, redirectUrl: string) {
	const scopes = candidate.additionalScopes
	if (!scopes || scopes.length === 0) {
		return { strategy: candidate.strategy as OAuthStrategy, redirectUrl }
	}

	return { strategy: candidate.strategy as OAuthStrategy, redirectUrl, additionalScopes: [...scopes] }
}

/**
 * Manages the social accounts linked to the signed-in user: which are connected, connecting a
 * new one, and disconnecting an existing one.
 */
function useConnectedAccounts() {
	const { user, isLoaded } = useUser()
	const queryClient = useQueryClient()

	// Clerk gates unlinking an account behind a recently verified session and answers
	// session_reverification_required otherwise. This wrapper puts up Clerk's verification
	// prompt and retries, instead of surfacing a 403 the user can do nothing about.
	const destroyExternalAccount = useReverification((account: ExternalAccountResource) => account.destroy())
	const [pendingProvider, setPendingProvider] = useState<string | null>(null)
	const [disconnectingId, setDisconnectingId] = useState<string | null>(null)

	const externalAccounts = user?.externalAccounts ?? []

	// Clerk requires at least one sign-in method. This instance authenticates purely through
	// social connections, so the final one has to stay.
	const verifiedCount = externalAccounts.filter((account) => account.verification?.status === "verified").length

	const accounts: ConnectedAccount[] = externalAccounts.map((account) => {
		const verified = account.verification?.status === "verified"
		return {
			id: account.id,
			provider: account.provider,
			label: labelFor(account.provider),
			username: account.username ?? undefined,
			emailAddress: account.emailAddress,
			imageUrl: account.imageUrl,
			verified,
			verificationError: account.verification?.error?.longMessage,
			approvedScopes: account.approvedScopes,
			missingScopes: verified ? missingScopesFor(account.provider, account.approvedScopes) : [],
			isLastSignInMethod: verified && verifiedCount <= 1,
			resource: account,
		}
	})

	const connectedProviders = new Set(accounts.map((account) => account.provider))
	const availableProviders = SUPPORTED_PROVIDERS.filter((candidate) => !connectedProviders.has(candidate.provider))

	// The account that stands for the user across the app. This instance has no username of its
	// own, so a connected provider login is the only handle there is; GitHub wins when several
	// are connected because it is listed first in SUPPORTED_PROVIDERS.
	const primaryAccount =
		SUPPORTED_PROVIDERS.map((candidate) =>
			accounts.find((account) => account.verified && account.provider === candidate.provider),
		).find(Boolean) ?? null

	/**
	 * Starts the OAuth handshake. Clerk creates a pending external account and hands back the URL
	 * to send the browser to; control comes back to `redirectUrl` once the provider responds.
	 *
	 * This leaves the page entirely, so there is nothing to invalidate afterwards: the return trip
	 * is a fresh page load with an empty query cache.
	 */
	const connect = useCallback(
		async (candidate: SupportedProvider) => {
			if (!user) {
				throw new Error("You must be signed in to connect an account.")
			}

			setPendingProvider(candidate.provider)

			try {
				const externalAccount = await user.createExternalAccount(
					linkParams(candidate, `${window.location.origin}/profile`),
				)

				const redirectUrl = externalAccount.verification?.externalVerificationRedirectURL
				if (!redirectUrl) {
					throw new Error(`${candidate.label} did not return an authorization URL.`)
				}

				window.location.href = redirectUrl.toString()
			} catch (error) {
				setPendingProvider(null)
				throw new Error(
					clerkErrorMessage(
						error,
						`Could not connect ${candidate.label}. It may not be enabled for this instance.`,
					),
				)
			}
		},
		[user],
	)

	/**
	 * Sends an already-connected account back through the provider's consent screen to pick up
	 * scopes it never had.
	 *
	 * Without this an account connected by signing in is a dead end: it only carries the sign-in
	 * scopes, connecting again is not offered because the provider is already linked, and
	 * disconnecting is refused when it is the only way left to sign in.
	 */
	const reauthorize = useCallback(async (account: ConnectedAccount) => {
		const candidate = providerFor(account.provider)
		if (!candidate) {
			throw new Error(`SSHark does not manage keys for ${account.label}.`)
		}

		setPendingProvider(account.provider)

		try {
			const { strategy: _strategy, ...reauthorizeParams } = linkParams(
				candidate,
				`${window.location.origin}/profile`,
			)
			const reauthorized = await account.resource.reauthorize(reauthorizeParams)

			const redirectUrl = reauthorized.verification?.externalVerificationRedirectURL
			if (!redirectUrl) {
				throw new Error(`${account.label} did not return an authorization URL.`)
			}

			window.location.href = redirectUrl.toString()
		} catch (error) {
			setPendingProvider(null)
			throw new Error(clerkErrorMessage(error, `Could not update ${account.label} permissions.`))
		}
	}, [])

	const disconnect = useCallback(
		async (account: ConnectedAccount) => {
			setDisconnectingId(account.id)

			try {
				await destroyExternalAccount(account.resource)
				await user?.reload()
				// The keys SSHark attributed to this account are no longer the user's to manage.
				queryClient.invalidateQueries({ queryKey: ["me", "keys"] })
			} catch (error) {
				throw new Error(clerkErrorMessage(error, `Could not disconnect ${account.label}.`))
			} finally {
				setDisconnectingId(null)
			}
		},
		[user, queryClient, destroyExternalAccount],
	)

	return {
		isLoaded,
		accounts,
		availableProviders,
		connect,
		reauthorize,
		disconnect,
		pendingProvider,
		disconnectingId,
		primaryAccount,
		canDeleteAccount: user?.deleteSelfEnabled ?? false,
	}
}

export { SUPPORTED_PROVIDERS, clerkErrorMessage, useConnectedAccounts }
export type { ConnectedAccount, SupportedProvider }
