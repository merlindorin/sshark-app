"use client"

import { Page, PageContent, PageHeader } from "@/components/pages/page"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { JSX } from "react"

enum Status {
    Default = "default",
    WIP = "WIP",
    Done = "Done",
}

export interface RoadmapItem {
    title: string
    description: string
    status: Status
}

export interface RoadmapItemProps extends RoadmapItem {
    index: number
}

function statusStyle(status: Status): string {
    switch (status) {
        case Status.WIP:
            return "bg-primary/20 text-primary"
        case Status.Done:
            return "bg-primary/5 text-primary"
    }

    return "bg-muted text-muted-foreground"
}

function RoadmapItem({index, status, description, title}: RoadmapItemProps): JSX.Element {
    return (
        <li className="flex gap-3">
            <span
                className={cn("flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ", statusStyle(status))}>{index}</span>
            <div>
                <div>
                    <span className="font-medium">{title}</span>
                    {status !== Status.Default && (
                        <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", statusStyle(status))}>
                        {status}
                    </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
        </li>
    )
}

const roadmapItems: RoadmapItem[] = [
    {
        title: "Be present online with an MVP",
        description: "Launch a working prototype to gather feedback and validate the concept.",
        status: Status.Done,
    },
    {
        title: "Fast, resilient and bullet-proof search engine",
        description: "Optimize query performance, add caching, and ensure high availability under load.",
        status: Status.WIP,
    },
    {
        title: "Provide public MCP server",
        description: "Expose sshark as an MCP server for seamless integration with AI assistants and tools.",
        status: Status.Default,
    },
    {
        title: "Add more providers",
        description: "Expand coverage to GitLab, Bitbucket, and other popular code hosting platforms.",
        status: Status.Default,
    },
    {
        title: "Periodically refetch public keys",
        description: "Keep the index fresh by automatically syncing keys on a regular schedule.",
        status: Status.Default,
    },
]

export default function Roadmap() {
    return (
        <Page>
            <PageHeader
                title="Roadmap"
                description="Our vision extends to comprehensive public/private key management across all
                    cryptographic key types. Here&apos;s what we&apos;re working on:"
            />
            <PageContent>
                <ol className="flex flex-col gap-6">
                    {roadmapItems.map((item, i) => (
                        <RoadmapItem key={i} index={i} {...item} />
                    ))}
                </ol>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">And later...</p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        <li>Add permalink for keys</li>
                        <li>Add authentication for manual key updates</li>
                        <li>Regroup accounts and certified keys</li>
                        <li>Key generation app</li>
                        <li>Sync keys across platforms</li>
                    </ul>
                </div>
                <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Have suggestions?
                        <Link href="https://github.com/merlindorin"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-foreground"
                        >Get in touch</Link>
                    </p>
                </div>
            </PageContent>
        </Page>
    )
}
