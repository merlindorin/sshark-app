const PROVIDER_LABELS: Record<string, string> = {
	github: "GitHub",
	gitlab: "GitLab",
	bitbucket: "Bitbucket",
}

/** Returns the provider's display name, falling back to the raw value. */
export function providerLabel(provider: string): string {
	return PROVIDER_LABELS[provider] ?? provider
}
