"use client"

import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import { ExternalLink, Key, ShieldCheck } from "lucide-react"
import type { ComponentType } from "react"
import { type GPGKey, GPGKeyCard } from "@/components/organisms/gpg-key-card"
import { SSHKeyCard } from "@/components/organisms/ssh-key-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Source, SSHKey } from "@/hooks/use-ssh-keys"

interface SourceDetail extends Source {
	id: string
	user_id: string
	username: string
	provider: string
	uri: string
	created_at: string
	updated_at: string
	ssh_keys: SSHKey[]
	gpg_keys: GPGKey[]
}

export type { SourceDetail }

interface ProviderConfig {
	name: string
	icon: ComponentType<{ size?: number; className?: string }>
	color: string
	avatarFor: (username: string) => string
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
	github: {
		name: "GitHub",
		icon: SiGithub,
		color: "hover:bg-[#181717] hover:text-white",
		avatarFor: (username) => `https://github.com/${username}.png`,
	},
	gitlab: {
		name: "GitLab",
		icon: SiGitlab,
		color: "hover:bg-[#FC6D26] hover:text-white",
		avatarFor: (username) => `https://gitlab.com/${username}.png`,
	},
}

const USERNAME_SPLIT_REGEX = /[-_]/

function initialsOf(username: string): string {
	return username
		.split(USERNAME_SPLIT_REGEX)
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase()
}

interface SourceViewProps {
	source: SourceDetail
}

export function SourceView({ source }: SourceViewProps) {
	const { provider, username, uri, ssh_keys, gpg_keys } = source
	const config = PROVIDER_CONFIGS[provider]
	const ProviderIcon = config?.icon
	const totalSsh = ssh_keys.length
	const totalGpg = gpg_keys.length

	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-16">
					<div className="mx-auto max-w-2xl px-4 text-center">
						<Avatar className="mx-auto h-32 w-32 border-4 border-background shadow-xl">
							<AvatarImage alt={username} src={config?.avatarFor(username)} />
							<AvatarFallback className="text-4xl">{initialsOf(username)}</AvatarFallback>
						</Avatar>
						<h1 className="mt-6 font-bold text-3xl tracking-tight">@{username}</h1>
						<p className="mt-2 text-lg text-muted-foreground">Public SSH &amp; GPG Keys</p>

						{config && (
							<div className="mt-4 flex justify-center gap-2">
								<Button asChild size="sm" variant="outline">
									<a
										className={`transition-colors ${config.color}`}
										href={uri}
										rel="noopener noreferrer"
										target="_blank">
										{ProviderIcon ? <ProviderIcon className="mr-2" size={16} /> : null}
										{config.name}
										<ExternalLink className="ml-2 h-3 w-3" />
									</a>
								</Button>
							</div>
						)}

						<div className="mt-4 flex justify-center gap-2">
							<Badge variant="secondary">
								<Key className="mr-1 h-3 w-3" />
								{totalSsh} SSH
							</Badge>
							<Badge variant="secondary">
								<ShieldCheck className="mr-1 h-3 w-3" />
								{totalGpg} GPG
							</Badge>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto mt-8 max-w-4xl space-y-10 px-4 pb-12 md:px-6">
				<section>
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-2xl">SSH Keys</h2>
						<Button asChild size="sm" variant="outline">
							<a download={`${username}.keys`} href={`/${username}.keys`}>
								Download Keys
							</a>
						</Button>
					</div>
					{totalSsh === 0 ? (
						<EmptyState description="This user has no public SSH keys" icon={Key} title="No SSH keys" />
					) : (
						<div className="space-y-4">
							{ssh_keys.map((key) => (
								<SSHKeyCard key={key.id} sshKey={key} />
							))}
						</div>
					)}
				</section>

				<section>
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-2xl">GPG Keys</h2>
					</div>
					{totalGpg === 0 ? (
						<EmptyState
							description="This user has no public GPG keys"
							icon={ShieldCheck}
							title="No GPG keys"
						/>
					) : (
						<div className="space-y-4">
							{gpg_keys.map((key) => (
								<GPGKeyCard gpgKey={key} key={key.id} />
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	)
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Key; title: string; description: string }) {
	return (
		<div className="rounded-lg border border-border border-dashed p-12 text-center">
			<Icon className="mx-auto h-10 w-10 text-muted-foreground" />
			<p className="mt-4 font-medium text-foreground">{title}</p>
			<p className="mt-1 text-muted-foreground text-sm">{description}</p>
		</div>
	)
}
