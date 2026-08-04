import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import { Link2 } from "lucide-react"
import type { ComponentType } from "react"

const PROVIDER_ICONS: Record<string, ComponentType<{ className?: string }>> = {
	github: SiGithub,
	gitlab: SiGitlab,
}

/** Renders a key provider's logo, falling back to a generic link glyph for unknown providers. */
export function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
	const Icon = PROVIDER_ICONS[provider] ?? Link2
	return <Icon className={className} />
}
