"use client"

import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"
import NumberFlow from "@number-flow/react"
import { GitBranchIcon, KeyIcon, Lock, RotateCcw, Search, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { type ComponentProps, type ComponentType, useState } from "react"
import { useInterval } from "usehooks-ts"
import { SearchBox } from "@/components/molecules/search-box"
import {
	Page,
	PageHeaderHero,
	PageHeaderHeroBadge,
	PageHeaderHeroDescription,
	PageHeaderHeroTitle,
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionSRTitle,
	PageSectionTitle,
} from "@/components/pages/page"
import { FAQ } from "@/components/templates/faq"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useStats } from "@/hooks/use-stats"
import { cn } from "@/lib/utils"

export function Home() {
	const [searchQuery, setSearchQuery] = useState("")
	const router = useRouter()

	const search = (query: string): void => {
		router.push(`/explore/${query}`)
	}

	return (
		<Page>
			<PageHeaderHero>
				<PageHeaderHeroBadge href="/explore">✨ Search across multiple platforms →</PageHeaderHeroBadge>
				<PageHeaderHeroTitle>Find Public SSH Keys</PageHeaderHeroTitle>
				<PageHeaderHeroDescription>
					Search for any user&apos;s public SSH keys or reverse lookup who owns a key. Quick, secure, and
					developer-friendly.
				</PageHeaderHeroDescription>
				<Stats className="mt-8" />
				<SearchBox
					className="mt-8"
					searchFn={search}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
				<ReassuringLine className="mt-8" />
			</PageHeaderHero>
			<PageSection divide={false}>
				<div className="mx-auto mb-16 flex w-full max-w-5xl flex-col items-center gap-6">
					<div>
						<svg
							className="w-full px-32 max-lg:hidden"
							fill="none"
							height="54"
							viewBox="0 0 786 54"
							width="786"
							xmlns="http://www.w3.org/2000/svg">
							<path
								clipRule="evenodd"
								d="M2.50004 48.0487C1.84768 48.1731 1.26519 48.5364 0.866448 49.0675C0.467704 49.5986 0.281373 50.2593 0.343881 50.9205C0.406389 51.5817 0.713242 52.1958 1.20445 52.6427C1.69566 53.0897 2.33591 53.3374 3.00004 53.3374C3.66416 53.3374 4.30441 53.0897 4.79562 52.6427C5.28683 52.1958 5.59369 51.5817 5.65619 50.9205C5.7187 50.2593 5.53237 49.5986 5.13363 49.0675C4.73488 48.5364 4.15239 48.1731 3.50004 48.0487V42.6687C3.50004 34.1087 10.44 27.1687 19 27.1687H377C384.716 27.1687 391.195 21.8727 393 14.7157C394.804 21.8717 401.284 27.1687 409 27.1687H767C775.56 27.1687 782.5 34.1087 782.5 42.6687V48.0487C781.848 48.1731 781.265 48.5364 780.866 49.0675C780.468 49.5986 780.281 50.2593 780.344 50.9205C780.406 51.5817 780.713 52.1958 781.204 52.6427C781.696 53.0897 782.336 53.3374 783 53.3374C783.664 53.3374 784.304 53.0897 784.796 52.6427C785.287 52.1958 785.594 51.5817 785.656 50.9205C785.719 50.2593 785.532 49.5986 785.134 49.0675C784.735 48.5364 784.152 48.1731 783.5 48.0487V42.6687C783.5 33.5567 776.113 26.1687 767 26.1687H409C400.44 26.1687 393.5 19.2287 393.5 10.6687V5.28867C394.152 5.16421 394.735 4.80092 395.134 4.26982C395.532 3.73873 395.719 3.078 395.656 2.41683C395.594 1.75565 395.287 1.14156 394.796 0.694599C394.304 0.247639 393.664 -5.72205e-05 393 -5.72205e-05C392.336 -5.72205e-05 391.696 0.247639 391.204 0.694599C390.713 1.14156 390.406 1.75565 390.344 2.41683C390.281 3.078 390.468 3.73873 390.866 4.26982C391.265 4.80092 391.848 5.16421 392.5 5.28867V10.6687C392.5 19.2287 385.56 26.1687 377 26.1687H19C9.88704 26.1687 2.50004 33.5567 2.50004 42.6687V48.0487ZM392.5 48.0487C391.848 48.1731 391.265 48.5364 390.866 49.0675C390.468 49.5986 390.281 50.2593 390.344 50.9205C390.406 51.5817 390.713 52.1958 391.204 52.6427C391.696 53.0897 392.336 53.3374 393 53.3374C393.664 53.3374 394.304 53.0897 394.796 52.6427C395.287 52.1958 395.594 51.5817 395.656 50.9205C395.719 50.2593 395.532 49.5986 395.134 49.0675C394.735 48.5364 394.152 48.1731 393.5 48.0487L393 14.7157L392.5 35.4874V48.0487Z"
								fill="var(--border)"
								fillRule="evenodd"
							/>
						</svg>
					</div>
					<div className="flex w-full flex-wrap items-center justify-center gap-8 max-md:flex-col lg:justify-between">
						<div className="flex max-w-3xs flex-col items-center gap-3.5 text-center">
							<Search className="stroke-[1.5]" size={32} />
							<span className="font-semibold text-primary">Advanced Search</span>
							<p className="text-muted-foreground">
								Query with powerful syntax using tag fields like @source.username, @fingerprint,
								@source.provider, and wildcards for precise results.
							</p>
						</div>
						<div className="flex max-w-3xs flex-col items-center gap-3.5 text-center">
							<Lock className="stroke-[1.5]" size={32} />
							<span className="font-semibold text-primary">Secure Access</span>
							<p className="text-muted-foreground">
								Search public SSH keys safely. All data is publicly available and accessed through
								secure APIs.
							</p>
						</div>
						<div className="flex max-w-3xs flex-col items-center gap-3.5 text-center">
							<RotateCcw className="stroke-[1.5]" size={32} />
							<span className="font-semibold text-primary">Reverse Lookup</span>
							<p className="text-muted-foreground">
								Find who owns a specific SSH key by searching the key content. Perfect for security
								audits and key management.
							</p>
						</div>
					</div>
				</div>
			</PageSection>
			<PageSection>
				<PageSectionSRTitle>Browse SSH Keys per-provider</PageSectionSRTitle>
				<PageSectionHeader>
					<PageSectionTitle>Browse by Platform</PageSectionTitle>
					<PageSectionParagraph>
						Explore SSH keys organized by platform. Quickly access keys from GitHub, GitLab, and other
						supported platforms.
					</PageSectionParagraph>
				</PageSectionHeader>
				<PageSectionContent>
					<ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
						<li>
							<a href="/explore/@source.provider:%7Bgithub%7D?advanced=true">
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
							<a href="/explore/@source.provider:%7Bgitlab%7D?advanced=true">
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
				</PageSectionContent>
			</PageSection>
			<PageSection className="py-8 sm:py-12 md:py-16">
				<div className="mx-auto max-w-3xl px-4">
					<header className="mb-6 text-center sm:mb-8 md:mb-10">
						<h2 className="mb-2 font-bold text-2xl tracking-tight sm:mb-4 sm:text-3xl lg:text-4xl">
							Frequently Asked Questions
						</h2>
						<p className="mx-auto max-w-2xl font-semibold text-base text-foreground sm:text-lg md:text-xl">
							Everything you need to know about SSHark and searching public SSH keys.
						</p>
					</header>
					<FAQ />
				</div>
			</PageSection>
		</Page>
	)
}

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
									@source.username, @fingerprint, @source.provider, @algorithm, @comment, @id
								</p>
							</div>
							<div>
								<p className="font-semibold">Query Syntax:</p>
								<p>
									<code className="mr-2">merlin</code>
									<span className="font-bold">simple search</span>
								</p>
								<p>
									<code className="mr-2">@source.username:{"{merlindorin}"}</code>
									<span className="font-bold">exact match</span>
								</p>
								<p>
									<code className="mr-2">@source.username:{"{merl*}"}</code>
									<span className="font-bold">wildcard</span>
								</p>
								<p>
									<code className="mr-2">@source.provider:{"{github|gitlab}"}</code>
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
									<span className="font-semibold">Just search the fingerprint:</span>
								</p>
								<p>
									<code className="mr-2">SHA256:abc...</code>
								</p>
							</div>
							<div>
								<p className="font-semibold">And if you feel geeky</p>
								<p>
									<code className="mr-2">@fingerprint:{"{SHA256:abc*}"}</code>
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
