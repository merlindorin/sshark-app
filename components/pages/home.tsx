"use client"

import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import NumberFlow from "@number-flow/react"
import { GitBranchIcon, KeyIcon, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { type ComponentProps, type ComponentType, useState } from "react"
import { useInterval } from "usehooks-ts"
import { SearchBox } from "@/components/molecules/search-box"
import { FAQ } from "@/components/templates/faq"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useStats } from "@/hooks/use-stats"
import { cn } from "@/lib/utils"

interface StatCardProps {
	label: string
	count: number
	Icon: ComponentType<{ className?: string }>
}

function StatCard({ label, Icon, count }: StatCardProps) {
	return (
		<div className="flex flex-col items-center text-left text-muted-foreground">
			<div className="flex items-center gap-2">
				<Icon className="size-5 text-accent" />
				<p className="font-bold md:text-2xl">
					<NumberFlow value={count} />
				</p>
			</div>
			<p className="text-sm md:text-base">{label}</p>
		</div>
	)
}

function Stats({ className }: ComponentProps<"div">) {
	const { data, refetch } = useStats()
	useInterval(refetch, 10_000)

	return (
		<div className={cn("flex items-center justify-center gap-4 md:gap-8", className)}>
			<StatCard count={data?.total_usernames || 0} Icon={UsersIcon} label="Usernames" />
			<div className="h-12 w-px bg-border" />
			<StatCard count={data?.total_keys || 0} Icon={KeyIcon} label="Key indexed" />
			<div className="h-12 w-px bg-border" />
			<StatCard count={data?.total_providers || 0} Icon={GitBranchIcon} label="Platforms" />
		</div>
	)
}

export function Home() {
	const [searchQuery, setSearchQuery] = useState("")
	const router = useRouter()

	const search = (query: string): void => {
		router.push(`/explore/${encodeURIComponent(query)}`)
	}

	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 min-h-100 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-24">
					<div className="mx-auto max-w-3xl px-4 text-center">
						<a className="group mb-4 inline-block" href="/about">
							<Badge className="px-3 py-1.5 font-medium text-sm" variant="secondary">
								<span className="sm:inline">✨ Search across multiple platforms →</span>
							</Badge>
						</a>
						<h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
							Find Public SSH Keys
						</h1>
						<p className="mx-auto mt-6 max-w-2xl font-semibold text-foreground text-xl">
							Search for any user&apos;s public SSH keys or reverse lookup who owns a key. Quick, secure,
							and developer-friendly.
						</p>
						<Stats className="mt-8" />
						<SearchBox
							className="mt-8"
							searchFn={search}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
						<ReassuringLine className="mt-8" />
					</div>
				</div>
			</section>
			<section className="container space-y-16 py-12 md:py-20">
				<h2 className="sr-only" id="provider-heading">
					Browse SSH Keys per-provider
				</h2>
				<section className="space-y-6">
					<header className="flex items-center justify-between">
						<div>
							<h3 className="mb-2 font-bold text-2xl tracking-tight" id="category-platforms">
								Browse by Platform
							</h3>
							<p className="max-w-4xl text-muted-foreground text-sm sm:text-base">
								Explore SSH keys organized by platform. Quickly access keys from GitHub, GitLab, and
								other supported platforms.
							</p>
						</div>
					</header>
					<ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
						<li>
							<a href="/explore/@provider:%7Bgithub%7D?fields=provider&advanced=true">
								<Card className="cursor-pointer pt-0 transition-all hover:border-accent hover:shadow-md">
									<CardContent className="relative aspect-16/10 overflow-hidden bg-[#F2F2F3] dark:bg-[#262529]">
										<div className="absolute inset-0 flex items-center justify-center">
											<SiGithub className="" size={60} />
										</div>
										<Badge className="absolute top-2 right-2">123,444 Keys</Badge>
									</CardContent>
									<CardFooter>Github</CardFooter>
								</Card>
							</a>
						</li>
						<li>
							<a href="/explore/@provider:%7Bgitlab%7D?fields=provider&advanced=true">
								<Card className="cursor-pointer pt-0 transition-all hover:border-accent hover:shadow-md">
									<CardContent className="relative aspect-16/10 overflow-hidden bg-[#F2F2F3] dark:bg-[#262529]">
										<div className="absolute inset-0 flex items-center justify-center">
											<SiGitlab className="" size={60} />
										</div>
										<Badge className="absolute top-2 right-2">13,444 Keys</Badge>
									</CardContent>
									<CardFooter>Gitlab</CardFooter>
								</Card>
							</a>
						</li>
					</ul>
				</section>
				<div className="mx-auto max-w-350 px-4 md:px-6">
					<section className="py-8 sm:py-12 md:py-16">
						<div className="mx-auto max-w-3xl px-4">
							<header className="mb-6 text-center sm:mb-8 md:mb-10">
								<h2 className="mb-2 font-bold text-2xl tracking-tight sm:mb-4 sm:text-3xl lg:text-4xl">
									Frequently Asked Questions
								</h2>
								<p className="mx-auto max-w-2xl font-semibold text-base text-foreground sm:text-lg md:text-xl">
									Everything you need to know about SSHark and searching public SSH keys.
								</p>
								<FAQ className="pt-8" />
							</header>
						</div>
					</section>
				</div>
			</section>
		</main>
	)
}

function FeatureDot() {
	return <div className="h-2 w-2 rounded-full bg-accent" />
}

function ReassuringLine({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(className, "flex items-center justify-center gap-4 text-muted-foreground text-sm")}
			{...props}>
			<div className="flex items-center gap-2">
				<FeatureDot />
				<span>Fast Lookup</span>
			</div>
			<div className="flex items-center gap-2">
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-pointer border-accent-foreground border-b border-dotted">
							Advanced Search
						</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<div className="space-y-2 text-xs">
							<div>
								<p className="font-semibold">Available Fields:</p>
								<p className="text-muted-foreground">
									@username, @key, @source, @provider, @type, @comment, @id
								</p>
							</div>
							<div>
								<p className="font-semibold">Query Syntax:</p>
								<p>
									<code className="mr-2">merlin</code>
									<span className="font-bold">simple search</span>
								</p>
								<p>
									<code className="mr-2">@username:{"{merlindorin}"}</code>
									<span className="font-bold">exact match</span>
								</p>
								<p>
									<code className="mr-2">@username:{"{merl*}"}</code>
									<span className="font-bold">wildcard</span>
								</p>
								<p>
									<code className="mr-2">@source:{"{github|gitlab}"}</code>
									<span className="font-bold">multiple values</span>
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center gap-2">
				<FeatureDot />
				<span>Secure access</span>
			</div>
			<div className="flex items-center gap-2">
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-pointer border-accent-foreground border-b border-dotted">
							Reverse Lookup
						</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<div className="space-y-2 text-xs">
							<div>
								<p>
									<span className="font-semibold">Just search the key:</span>
								</p>
								<p>
									<code className="mr-2">AAAAC3NzaC1lZD...</code>
								</p>
							</div>
							<div>
								<p className="font-semibold">And if you feel geeky</p>
								<p>
									<code className="mr-2">@key:{"{AAAAC3NzaC1lZD*}"}</code>
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
