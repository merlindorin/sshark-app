"use client"

import NumberFlow from "@number-flow/react"
import { GitBranchIcon, KeyIcon, UsersIcon } from "lucide-react"
import { type ComponentType, useState } from "react"
import { useInterval } from "usehooks-ts"

import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { P, Span } from "@/components/atoms/text"
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
		<Flex className="flex-col items-center text-left text-muted-foreground">
			<Flex className="items-center gap-2">
				<Icon className="h-5 w-5 text-accent" />
				<P className="font-bold text-xl md:text-2xl">
					<NumberFlow value={count} />
				</P>
			</Flex>
			<P className="text-sm md:text-base">{label}</P>
		</Flex>
	)
}

function Stats() {
	const { data, refetch } = useStats()
	useInterval(refetch, 10_000)

	return (
		<Flex className="items-center justify-center gap-4 md:gap-8">
			<StatCard count={data?.total_usernames || 0} Icon={UsersIcon} label="Usernames" />
			<Box className="h-12 w-px bg-border" />
			<StatCard count={data?.total_keys || 0} Icon={KeyIcon} label="Key indexed" />
			<Box className="h-12 w-px bg-border" />
			<StatCard count={data?.total_providers || 0} Icon={GitBranchIcon} label="Platforms" />
		</Flex>
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
			<Box className="w-full max-w-4xl">
				<SSHKeyResults
					data={data}
					searchFn={search}
					searchIsError={isError}
					searchIsFetching={isFetching}
					searchQuery={toSearchQuery}
				/>
			</Box>
		</Page>
	)
}

interface ReassuringLineProps {
	data?: SearchResponse | undefined
}

function FeatureDot() {
	return <Box className="h-2 w-2 rounded-full bg-accent" />
}

function ReassuringLine({ data }: ReassuringLineProps) {
	return (
		<Flex className="items-center justify-center gap-4 text-muted-foreground text-sm">
			<Flex className="items-center gap-2">
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Fast Lookup</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box className="space-y-2 text-xs">
							<Box>
								<P>
									<Span className="font-bold">Last query duration: </Span>
									<code className="mr-2">
										{data ? `${(data.duration / 1_000_000).toFixed(2)}ms` : "-"}
									</code>
								</P>
							</Box>
						</Box>
					</TooltipContent>
				</Tooltip>
			</Flex>
			<Flex className="items-center gap-2">
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Advanced Search</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box className="space-y-2 text-xs">
							<Box>
								<P className="font-semibold">Available Fields:</P>
								<P className="text-muted-foreground">
									@username, @key, @source, @provider, @type, @comment, @id
								</P>
							</Box>
							<Box>
								<P className="font-semibold">Query Syntax:</P>
								<P>
									<code className="mr-2">merlin</code>
									<Span className="font-bold">simple search</Span>
								</P>
								<P>
									<code className="mr-2">@username:{"{merlindorin}"}</code>
									<Span className="font-bold">exact match</Span>
								</P>
								<P>
									<code className="mr-2">@username:{"{merl*}"}</code>
									<Span className="font-bold">wildcard</Span>
								</P>
								<P>
									<code className="mr-2">@source:{"{github|gitlab}"}</code>
									<Span className="font-bold">multiple values</Span>
								</P>
							</Box>
						</Box>
					</TooltipContent>
				</Tooltip>
			</Flex>
			<Flex className="items-center gap-2">
				<FeatureDot />
				<Span>Secure access</Span>
			</Flex>
			<Flex className="items-center gap-2">
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Reverse Lookup</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box className="space-y-2 text-xs">
							<Box>
								<P>
									<Span className="font-semibold">Just search the key:</Span>
								</P>
								<P>
									<code className="mr-2">AAAAC3NzaC1lZD...</code>
								</P>
							</Box>
							<Box>
								<P className="font-semibold">And if you feel geeky</P>
								<P>
									<code className="mr-2">@key:{"{AAAAC3NzaC1lZD*}"}</code>
								</P>
							</Box>
						</Box>
					</TooltipContent>
				</Tooltip>
			</Flex>
		</Flex>
	)
}
