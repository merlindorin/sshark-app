"use client"

import {ExternalLink, Github, Gitlab, Key, type LucideIcon, User} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {SearchResponse} from "@/hooks/use-ssh-keys";

const platformConfig: { [key: string]: { icon: LucideIcon; label: string } } = {
    github: {
        icon: Github,
        label: "GitHub",
    },
    gitlab: {
        icon: Gitlab,
        label: "GitLab",
    },
    bitbucket: {
        icon: Key,
        label: "Bitbucket",
    },
    manual: {
        icon: Key,
        label: "Manual",
    },
}

function highlightMatch(text: string, query: string) {
    if (!query) return <span>{text}</span>

    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)

    if (index === -1) return <span>{text}</span>

    return (
        <>
            {text.slice(0, index)}
            <mark
                className="bg-accent/30 text-foreground font-semibold">{text.slice(index, index + query.length)}</mark>
            {text.slice(index + query.length)}
        </>
    )
}

export function SSHKeyResults({searchQuery, data}: { searchQuery: string; data: SearchResponse | undefined }) {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copyToClipboard = (key: string, id: string) => {
        navigator.clipboard.writeText(key)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (data?.entities.length === 0) {
        return (
            <Card className="w-full border-border bg-card">
                <CardContent className="py-12 text-center">
                    <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <p className="text-lg font-medium text-foreground">No SSH keys found</p>
                    <p className="text-sm text-muted-foreground mt-2">No public SSH keys found for query
                        &#34;{searchQuery}&#34;</p>
                </CardContent>
            </Card>
        )
    }

    const hasExactMatch = true

    return (
        <Card className="w-full border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Key className="h-5 w-5"/>
                    Public SSH Keys for <span
                    className="font-mono text-accent">{highlightMatch(searchQuery, searchQuery)}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Found {data?.entities.length} public SSH key{data?.entities.length !== 1 ? "s" : ""} across
                    platforms
                    {hasExactMatch && (
                        <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent">
                            Exact Match
                        </Badge>
                    )}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.entities.map((sshKey) => {
                    const config = platformConfig[sshKey.provider] || ""
                    const Icon = config.icon

                    return (
                        <div
                            key={sshKey.id}
                            className="space-y-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex grow items-center gap-3 flex-wrap">
                                    <Badge
                                        className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                                        <Icon/>
                                        {config.label}
                                    </Badge>
                                    <Badge
                                        className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20 font-mono">
                                        <User/>
                                        {sshKey.username}
                                    </Badge>
                                    <span className="grow"/>
                                    <span className="text-sm text-muted-foreground">
                                        Updated {new Date(sshKey.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(sshKey.source, '_blank')?.focus()}
                                        className="shrink-0, mr-2"
                                    >
                                        <ExternalLink className="mr-0 h-1 w-10"/>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(sshKey.key, sshKey.id)}
                                        className="shrink-0 ml-0"
                                    >
                                        {copiedId === sshKey.id ? "Copied!" : "Copy"}
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <code
                                    className="block rounded bg-muted px-3 py-2 text-xs font-mono text-foreground break-all">
                                    {sshKey.key}
                                </code>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
