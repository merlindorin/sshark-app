import { SiBitbucket, SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import { KeyIcon, type LucideIcon, ServerIcon, UsersIcon } from "lucide-react"
import type { JSX } from "react"
import { Pill, PillIcon, type PillProps } from "@/components/kibo-ui/pill"

const providerIcons: Record<string, LucideIcon | typeof SiGithub> = {
	github: SiGithub,
	gitlab: SiGitlab,
	bitbucket: SiBitbucket,
}

interface HomePillProps extends PillProps {
	icon: LucideIcon
	label: string
}

export function HomePill({ icon, label, ...props }: HomePillProps) {
	return (
		<Pill className="cursor-pointer" {...props}>
			<PillIcon icon={icon} />
			{label}
		</Pill>
	)
}

export function ProviderPill({ provider, ...props }: { provider: string } & PillProps): JSX.Element {
	const Icon = providerIcons[provider] ?? ServerIcon
	return (
		<Pill className="cursor-pointer" {...props}>
			<Icon className="size-3 text-muted-foreground" />
			{provider}
		</Pill>
	)
}

export function UserPill({ user, ...props }: { user: string } & PillProps): JSX.Element {
	return <HomePill icon={UsersIcon} label={user} {...props} />
}

export function KeyPill({ keyType, ...props }: { keyType: string } & PillProps): JSX.Element {
	return <HomePill icon={KeyIcon} label={keyType} {...props} />
}
