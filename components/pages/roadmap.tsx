"use client"

import Link from "next/link"
import type { JSX } from "react"
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
		<li className="flex gap-3">
			<div
				className={cn(
					"flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium text-sm",
					statusStyle(status),
				)}>
				{index}
			</div>
			<div>
				<div>
					<span className="font-medium">{title}</span>
					{status !== STATUS.Default && (
						<span className={cn("ml-2 rounded-full px-2 py-0.5 text-xs", statusStyle(status))}>
							{status}
						</span>
					)}
				</div>
				<p className="mt-1 text-muted-foreground text-sm">{description}</p>
			</div>
		</li>
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
				badge={{ label: "🚀 What's next for SSHark", href: "/about" }}
				description="Our vision extends to comprehensive public/private key management across all cryptographic key types. Here's what we're working on:"
				title="Roadmap"
			/>
			<PageContent>
				<ol className="flex flex-col gap-6">
					{roadmapItems.map((item, i) => (
						<RoadmapItem index={i} key={item.title} {...item} />
					))}
				</ol>
				<div className="flex flex-col gap-4">
					<p className="text-muted-foreground text-sm">And later...</p>
					<ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm">
						<li>Add permalink for keys</li>
						<li>Add authentication for manual key updates</li>
						<li>Regroup accounts and certified keys</li>
						<li>Key generation app</li>
						<li>Sync keys across platforms</li>
					</ul>
				</div>
				<div className="border-border border-t pt-4">
					<p className="text-muted-foreground text-sm">
						Have suggestions?{" "}
						<Link
							className="underline hover:text-foreground"
							href="https://github.com/merlindorin"
							rel="noopener noreferrer"
							target="_blank">
							Get in touch
						</Link>
					</p>
				</div>
			</PageContent>
		</Page>
	)
}
