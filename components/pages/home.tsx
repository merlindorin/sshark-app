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
		<Flex align="center" className="text-muted-foreground" direction="col" textAlign="left">
			<Flex align="center" gap={2}>
				<Icon className="h-5 w-5 text-accent" />
				<P fontWeight="bold" textSize={{ md: "2xl", default: "xl" }}>
					<NumberFlow value={count} />
				</P>
			</Flex>
			<P textSize={{ default: "sm", md: "base" }}>{label}</P>
		</Flex>
	)
}

function Stats() {
	const { data, refetch } = useStats()
	useInterval(refetch, 10_000)

	return (
		<Flex align="center" gap={{ default: 4, md: 8 }} justify="center">
			<StatCard count={data?.total_usernames || 0} Icon={UsersIcon} label="Usernames" />
			<Box className="bg-border" h={12} w="px" />
			<StatCard count={data?.total_keys || 0} Icon={KeyIcon} label="Key indexed" />
			<Box className="bg-border" h={12} w="px" />
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
			<Box maxW="4xl" w="full">
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
	return <Box bg="accent" h={2} rounded="full" w={2} />
}

function ReassuringLine({ data }: ReassuringLineProps) {
	return (
		<Flex align="center" gap={4} justify="center" textColor="muted-foreground" textSize="sm">
			<Flex align="center" gap={2}>
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Fast Lookup</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box spaceY={2} textSize="xs">
							<Box>
								<P>
									<Span fontWeight="bold">Last query duration: </Span>
									<code className="mr-2">
										{data ? `${(data.duration / 1_000_000).toFixed(2)}ms` : "-"}
									</code>
								</P>
							</Box>
						</Box>
					</TooltipContent>
				</Tooltip>
			</Flex>
			<Flex align="center" gap={2}>
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Advanced Search</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box spaceY={2} textSize="xs">
							<Box>
								<P fontWeight="semibold">Available Fields:</P>
								<P textColor="muted-foreground">
									@username, @key, @source, @provider, @type, @comment, @id
								</P>
							</Box>
							<Box>
								<P fontWeight="semibold">Query Syntax:</P>
								<P>
									<code className="mr-2">merlin</code>
									<Span fontWeight="bold">simple search</Span>
								</P>
								<P>
									<code className="mr-2">@username:{"{merlindorin}"}</code>
									<Span fontWeight="bold">exact match</Span>
								</P>
								<P>
									<code className="mr-2">@username:{"{merl*}"}</code>
									<Span fontWeight="bold">wildcard</Span>
								</P>
								<P>
									<code className="mr-2">@source:{"{github|gitlab}"}</code>
									<Span fontWeight="bold">multiple values</Span>
								</P>
							</Box>
						</Box>
					</TooltipContent>
				</Tooltip>
			</Flex>
			<Flex align="center" gap={2}>
				<FeatureDot />
				<Span>Secure access</Span>
			</Flex>
			<Flex align="center" gap={2}>
				<FeatureDot />
				<Tooltip>
					<TooltipTrigger asChild className="cursor-pointer">
						<span className="border-b-1 border-dotted">Reverse Lookup</span>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side="bottom">
						<Box spaceY={2} textSize="xs">
							<Box>
								<P>
									<Span fontWeight="semibold">Just search the key:</Span>
								</P>
								<P>
									<code className="mr-2">AAAAC3NzaC1lZD...</code>
								</P>
							</Box>
							<Box>
								<P fontWeight="semibold">And if you feel geeky</P>
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
