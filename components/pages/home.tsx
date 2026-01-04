"use client"

import NumberFlow from "@number-flow/react"
import { GitBranchIcon, KeyIcon, UsersIcon } from "lucide-react"
import { type ComponentType, useState } from "react"
import { useInterval } from "usehooks-ts"
import { SearchBox } from "@/components/molecules/search-box"
import Headline from "@/components/pages/headline"
import { Page, PageHeader } from "@/components/pages/page"
import { SSHKeyResults } from "@/components/ssh-key-result"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type SearchResponse, useSshKeys } from "@/hooks/use-ssh-keys"
import { useStats } from "@/hooks/use-stats"

interface StatCardProps {
	label: string
	count: number
	Icon: ComponentType<{ className?: string }>
}

function StatCard({ label, Icon, count }: StatCardProps) {
	return (
		<div className="flex flex-col items-center text-left text-muted-foreground">
			<div className="flex flex-row items-center gap-2">
				<Icon className="h-5 w-5 text-accent" />
				<p className="font-bold text-foreground text-xl md:text-2xl">
					<NumberFlow value={count} />
				</p>
			</div>
			<p className="text-sm md:text-md">{label}</p>
		</div>
	)
}

function Stats() {
	const { data, refetch } = useStats()
	useInterval(refetch, 10_000)

	return (
		<div className="flex items-center justify-center gap-4 md:gap-8">
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
	const [toSearchQuery, setToSearchQuery] = useState("")
	const { data, refetch, isError, isFetching } = useSshKeys(toSearchQuery)

	const search = (s: string): void => {
		setSearchQuery(s)

		const trimmed = s.trim()

		if (toSearchQuery !== trimmed && trimmed !== "") {
			setToSearchQuery(trimmed)
			return
		}

		if (toSearchQuery !== "") {
			refetch()
		}
	}

	return (
		<Page>
			<PageHeader className="gap-8 text-center">
				<Headline />
				<Stats />
				<SearchBox searchFn={search} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<ReassuringLine data={data} />
			</PageHeader>
			<div className="w-full max-w-4xl">
				<SSHKeyResults
					data={data}
					searchFn={search}
					searchIsError={isError}
					searchIsFetching={isFetching}
					searchQuery={toSearchQuery}
				/>
			</div>
		</Page>
	)
}

interface ReassuringLineProps {
	data?: SearchResponse | undefined
}

function ReassuringLine({ data }: ReassuringLineProps) {
	return (
		<div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
			<div className="flex items-center gap-2">
				<div className="h-2 w-2 rounded-full bg-accent" />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Fast Lookup</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side={"bottom"}>
						<div className="space-y-2 text-xs">
							<div>
								<p>
									<span className="font-bold">Last query duration: </span>
									<code className="mr-2">
										{data ? `${(data.duration / 1_000_000).toFixed(2)}ms` : "-"}
									</code>
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center gap-2">
				<div className="h-2 w-2 rounded-full bg-accent" />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className={"border-b-1 border-dotted"}>Advanced Search</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side={"bottom"}>
						<div className="space-y-2 text-xs">
							<div>
								<p className="font-semibold">Text Fields:</p>
								<p className="text-muted-foreground">@username, @comment, @updated_at</p>
							</div>
							<div>
								<p className="font-semibold">Tag Fields:</p>
								<p className="text-muted-foreground">@id, @key, @source, @type</p>
							</div>
							<div>
								<p className="font-semibold">Redis Query Engine Syntax:</p>
								<p>
									<code className="mr-2">@textfield:merlin</code>
									<span className="font-bold">text field search</span>
								</p>
								<p>
									<code className="mr-2">@tagfield:{"{github|gitlab}"}</code>
									<span className="font-bold"> tag field search</span>
								</p>
								<p>
									<code className="mr-2">merl*</code>
									<span className="font-bold"> wildcard search</span>
								</p>
								<p>
									<code className="mr-2">&#34;merlindorin&#34;</code>
									<span className="font-bold"> exact phrase</span>
								</p>
								<p>
									<code className="mr-2">%typo%</code>
									<span className="font-bold"> fuzzy search</span>
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</div>
			<div className="flex items-center gap-2">
				<div className="h-2 w-2 rounded-full bg-accent" />
				<span>Secure access</span>
			</div>
			<div className="flex items-center gap-2">
				<div className="h-2 w-2 rounded-full bg-accent" />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Reverse Lookup</span>
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
