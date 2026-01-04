import { SiBitbucket, SiGithub, SiGitlab, SiHandm } from "@icons-pack/react-simple-icons"
import type { MouseEventHandler } from "react"
import { Pill, PillIcon } from "@/components/kibo-ui/pill"

function getProviderIcon(provider: string) {
	switch (provider) {
		case "github":
			return SiGithub
		case "gitlab":
			return SiGitlab
		case "bitbucket":
			return SiBitbucket
		default:
			return SiHandm
	}
}

export function ProviderPill({ provider, onClick }: { provider: string; onClick: MouseEventHandler }) {
	return (
		<Pill className="cursor-pointer" onClick={onClick}>
			<PillIcon icon={getProviderIcon(provider)} />
			{`${provider}`}
		</Pill>
	)
}
