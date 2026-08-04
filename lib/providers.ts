/**
 * Where a provider account lives, on the provider itself. SSHark used to host its own page per
 * source; now that people get an SSHark profile only by claiming one, an indexed account that
 * nobody claimed is best represented by the provider's own page.
 */
const PROVIDER_PROFILE_URLS: Record<string, (username: string) => string> = {
	github: (username) => `https://github.com/${encodeURIComponent(username)}`,
	gitlab: (username) => `https://gitlab.com/${encodeURIComponent(username)}`,
	bitbucket: (username) => `https://bitbucket.org/${encodeURIComponent(username)}`,
}

const PROVIDER_LABELS: Record<string, string> = {
	github: "GitHub",
	gitlab: "GitLab",
	bitbucket: "Bitbucket",
}

/** Returns the account's page at its provider, or undefined for a provider we cannot address. */
export function providerProfileUrl(provider: string, username: string): string | undefined {
	return PROVIDER_PROFILE_URLS[provider]?.(username)
}

/** Returns the provider's display name, falling back to the raw value. */
export function providerLabel(provider: string): string {
	return PROVIDER_LABELS[provider] ?? provider
}
