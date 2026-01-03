import { KeyPill } from "@/components/molecules/key-pill"
import { ProviderPill } from "@/components/molecules/provider-pill"
import { UserPill } from "@/components/molecules/user-pill"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchResponse } from "@/hooks/use-ssh-keys"
import { CopyIcon, ExternalLink, Key, LucideLoaderCircle, MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

export function SSHKeyResults({searchQuery, data, searchFn, searchIsError, searchIsFetching}: {
    searchQuery: string,
    searchFn: (s: string) => void
    searchIsError: boolean,
    searchIsFetching: boolean,
    data: SearchResponse | undefined,
}) {
    const copyToClipboard = (key: string, id: string) => {
        navigator.clipboard.writeText(key)
        toast.success("Copied to clipboard")
    }

    if (searchIsError) {
        return (
            <Card className="w-full border-border bg-card">
                <CardContent className="py-12 text-center">
                    <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <p className="text-lg font-medium text-foreground">Oops</p>
                    <p className="text-sm text-muted-foreground mt-2">Something goes wrong</p>
                </CardContent>
            </Card>
        )
    }

    if (searchIsFetching) {
        return (
            <Card className="w-full border-border bg-card">
                <CardContent className="py-12 text-center">
                    <LucideLoaderCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin"/>
                    <p className="text-lg font-medium text-foreground">Searching...</p>
                </CardContent>
            </Card>
        )
    }

    if (data === undefined) {
        return null
    }

    if (data.entities.length === 0) {
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
                    className="text-primary font-mono">{searchQuery}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Found {data?.entities.length} public SSH key{data?.entities.length !== 1 ? "s" : ""} across
                    platforms
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.entities.map((sshKey) => {

                    return (
                        <div
                            key={sshKey.id}
                            className="space-y-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex grow items-center gap-1 flex-wrap">
                                    <ProviderPill provider={sshKey.provider}
                                                  onClick={() => searchFn(`@provider:{${sshKey.provider}}`)}/>
                                    <UserPill user={sshKey.username}
                                              onClick={() => searchFn(`@username:${sshKey.username.replaceAll(`-`, `\\-`)}`)}/>
                                    <KeyPill keyType={sshKey.type}
                                             onClick={() => searchFn(`@type:{${sshKey.type.replaceAll(`-`, `\\-`)}}`)}/>
                                </div>
                                <div className="flex">
                                    <ButtonGroup>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost">
                                                    <MoreHorizontalIcon/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => copyToClipboard(sshKey.key, sshKey.id)}>
                                                    <CopyIcon
                                                        className="mr-0 h-1 w-10"/> Copy</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => window.open(sshKey.source, '_blank')?.focus()}><ExternalLink
                                                    className="mr-0 h-1 w-10"/> Source</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <code
                                    className="block rounded bg-muted px-3 py-2 text-xs font-mono text-foreground break-all">
                                    {`${sshKey.type} ${sshKey.key}`}
                                </code>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
