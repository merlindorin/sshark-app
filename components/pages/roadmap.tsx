"use client"

import Link from "next/link"
import type { JSX } from "react"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { Li, Ul } from "@/components/atoms/list"
import { P, Span } from "@/components/atoms/text"
import { Page, PageContent, PageHeaderHero } from "@/components/pages/page"
import { cn } from "@/lib/utils"

export const STATUS = {
	Default: "default",
	WIP: "WIP",
	Done: "Done",
} as const

export type STATUS = (typeof STATUS)[keyof typeof STATUS]

export interface RoadmapItem {
	title: string
	description: string
	status: STATUS
}

export interface RoadmapItemProps extends RoadmapItem {
	index: number
}

function statusStyle(status: STATUS): string {
	switch (status) {
		case STATUS.WIP:
			return "bg-primary/20 text-primary"
		case STATUS.Done:
			return "bg-primary/5 text-primary"
		default:
			return "bg-muted text-muted-foreground"
	}
}

function RoadmapItem({ index, status, description, title }: RoadmapItemProps): JSX.Element {
	return (
		<Flex as="li" gap={3}>
			<Flex
				align="center"
				className={cn(statusStyle(status))}
				fontWeight="medium"
				h={6}
				justify="center"
				rounded="full"
				shrink="false"
				textSize="sm"
				w={6}>
				{index}
			</Flex>
			<Box>
				<Box>
					<Span fontWeight="medium">{title}</Span>
					{status !== STATUS.Default && (
						<Span className={cn("ml-2", statusStyle(status))} px={2} py={0.5} rounded="full" textSize="xs">
							{status}
						</Span>
					)}
				</Box>
				<P mt={1} textColor="muted-foreground" textSize="sm">
					{description}
				</P>
			</Box>
		</Flex>
	)
}

const roadmapItems: RoadmapItem[] = [
	{
		title: "Be present online with an MVP",
		description: "Launch a working prototype to gather feedback and validate the concept.",
		status: STATUS.Done,
	},
	{
		title: "Fast, resilient and bullet-proof search engine",
		description: "Optimize query performance, add caching, and ensure high availability under load.",
		status: STATUS.WIP,
	},
	{
		title: "Provide public MCP server",
		description: "Expose sshark as an MCP server for seamless integration with AI assistants and tools.",
		status: STATUS.Default,
	},
	{
		title: "Add more providers",
		description: "Expand coverage to GitLab, Bitbucket, and other popular code hosting platforms.",
		status: STATUS.Default,
	},
	{
		title: "Periodically refetch public keys",
		description: "Keep the index fresh by automatically syncing keys on a regular schedule.",
		status: STATUS.Default,
	},
]

export default function Roadmap() {
	return (
		<Page>
			<PageHeaderHero
				description="Our vision extends to comprehensive public/private key management across all
                    cryptographic key types. Here&apos;s what we&apos;re working on:"
				title="Roadmap"
			/>
			<PageContent>
				<Flex as="ol" direction="col" gap={6}>
					{roadmapItems.map((item, i) => (
						<RoadmapItem index={i} key={item.title} {...item} />
					))}
				</Flex>
				<Flex direction="col" gap={4}>
					<P textColor="muted-foreground" textSize="sm">
						And later...
					</P>
					<Ul className="list-inside list-disc" spaceY={2} textColor="muted-foreground" textSize="sm">
						<Li>Add permalink for keys</Li>
						<Li>Add authentication for manual key updates</Li>
						<Li>Regroup accounts and certified keys</Li>
						<Li>Key generation app</Li>
						<Li>Sync keys across platforms</Li>
					</Ul>
				</Flex>
				<Box borderColor="border" borderT={1} pt={4}>
					<P textColor="muted-foreground" textSize="sm">
						Have suggestions?{" "}
						<Link
							className="underline hover:text-foreground"
							href="https://github.com/merlindorin"
							rel="noopener noreferrer"
							target="_blank">
							Get in touch
						</Link>
					</P>
				</Box>
			</PageContent>
		</Page>
	)
}
