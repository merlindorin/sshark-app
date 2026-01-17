"use client"

import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import { ExternalLink, Key, Server } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import type { ComponentType } from "react"
import { useMemo } from "react"
import { SSHKeyCard } from "@/components/organisms/ssh-key-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSshKeys } from "@/hooks/use-ssh-keys"
import { isReservedUsername } from "@/lib/reserved-usernames"

interface ProviderConfig {
	name: string
	icon: ComponentType<{ size?: number; className?: string }>
	getUrl: (username: string) => string
	color: string
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
	github: {
		name: "GitHub",
		icon: SiGithub,
		getUrl: (username) => `https://github.com/${username}`,
		color: "hover:bg-[#181717] hover:text-white",
	},
	gitlab: {
		name: "GitLab",
		icon: SiGitlab,
		getUrl: (username) => `https://gitlab.com/${username}`,
		color: "hover:bg-[#FC6D26] hover:text-white",
	},
}

const USERNAME_SPLIT_REGEX = /[-_]/

function ProfileSkeleton() {
	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-16">
					<div className="mx-auto max-w-2xl px-4 text-center">
						<Skeleton className="mx-auto h-32 w-32 rounded-full" />
						<Skeleton className="mx-auto mt-6 h-8 w-48" />
						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							<Skeleton className="h-20 w-full rounded-lg" />
							<Skeleton className="h-20 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</section>
			<div className="mx-auto mt-8 max-w-4xl px-4 md:px-6">
				<Skeleton className="h-64 w-full rounded-lg" />
			</div>
		</main>
	)
}

function StatItem({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Key }) {
	return (
		<div className="flex flex-col items-center gap-1 text-center">
			<Icon className="h-5 w-5 text-accent" />
			<p className="font-bold text-2xl">{value}</p>
			<p className="text-muted-foreground text-xs">{label}</p>
		</div>
	)
}

export default function PublicProfilePage() {
	const params = useParams<{ username: string }>()
	const username = params?.username

	if (!username || isReservedUsername(username)) {
		notFound()
	}

	const searchQuery = `@username:{${username}}`
	const { data, isLoading, error } = useSshKeys(searchQuery, 100, 0)

	const initials = username
		.split(USERNAME_SPLIT_REGEX)
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase()

	const providers = useMemo(() => {
		if (!data?.entities) {
			return new Set<string>()
		}
		return new Set(data.entities.flat().map((key) => key.provider))
	}, [data])

	if (isLoading) {
		return <ProfileSkeleton />
	}

	if (error || !data) {
		notFound()
	}

	const sshKeys = data.entities.flat()
	const totalKeys = data.total

	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-16">
					<div className="mx-auto max-w-2xl px-4">
						<div className="text-center">
							<Avatar className="mx-auto h-32 w-32 border-4 border-background shadow-xl">
								<AvatarImage alt={username} src={`https://github.com/${username}.png`} />
								<AvatarFallback className="text-4xl">{initials}</AvatarFallback>
							</Avatar>
							<h1 className="mt-6 font-bold text-3xl tracking-tight">@{username}</h1>
							<p className="mt-2 text-lg text-muted-foreground">Public SSH Keys</p>

							{providers.size > 0 && (
								<div className="mt-4 flex justify-center gap-2">
									{Array.from(providers)
										.filter((provider) => provider in PROVIDER_CONFIGS)
										.map((provider) => {
											const config = PROVIDER_CONFIGS[provider]
											const Icon = config.icon
											return (
												<Button asChild key={provider} size="sm" variant="outline">
													<a
														className={`transition-colors ${config.color}`}
														href={config.getUrl(username)}
														rel="noopener noreferrer"
														target="_blank">
														<Icon className="mr-2" size={16} />
														{config.name}
														<ExternalLink className="ml-2 h-3 w-3" />
													</a>
												</Button>
											)
										})}
								</div>
							)}

							<div className="mt-4 flex justify-center gap-2">
								<Badge variant="secondary">
									<Key className="mr-1 h-3 w-3" />
									{totalKeys} {totalKeys === 1 ? "key" : "keys"}
								</Badge>
								<Badge variant="outline">
									<Server className="mr-1 h-3 w-3" />
									{providers.size} {providers.size === 1 ? "provider" : "providers"}
								</Badge>
							</div>
						</div>

						<div className="mt-10 flex items-center justify-center gap-8 rounded-xl border border-border/50 bg-background/50 p-6">
							<StatItem icon={Key} label="SSH Keys" value={totalKeys} />
							<div className="h-12 w-px bg-border" />
							<StatItem icon={Server} label="Providers" value={providers.size} />
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto mt-8 max-w-4xl px-4 pb-8 md:px-6">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold text-2xl">SSH Keys</h2>
					<Button asChild size="sm" variant="outline">
						<a download={`${username}.keys`} href={`/${username}.keys`}>
							Download Keys
						</a>
					</Button>
				</div>

				{sshKeys.length === 0 ? (
					<div className="rounded-lg border border-border border-dashed p-12 text-center">
						<Key className="mx-auto h-10 w-10 text-muted-foreground" />
						<p className="mt-4 font-medium text-foreground">No SSH keys found</p>
						<p className="mt-1 text-muted-foreground text-sm">This user has no public SSH keys</p>
					</div>
				) : (
					<div className="space-y-4">
						{sshKeys.map((key) => (
							<SSHKeyCard key={key.id} sshKey={key} />
						))}
					</div>
				)}

				<div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
					<h3 className="mb-2 font-semibold text-sm">Available Formats</h3>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<code className="rounded bg-muted px-2 py-1 font-mono text-xs">
								curl https://sshark.app/{username}.keys
							</code>
							<span className="text-muted-foreground">OpenSSH format</span>
						</div>
						<div className="flex items-center gap-2">
							<code className="rounded bg-muted px-2 py-1 font-mono text-xs">
								https://sshark.app/{username}
							</code>
							<span className="text-muted-foreground">Web view</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
