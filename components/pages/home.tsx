"use client"

import { SearchBox } from "@/components/molecules/SearchBox"
import Headline from "@/components/pages/Headline"
import { Page } from "@/components/pages/page"
import { SSHKeyResults } from "@/components/ssh-key-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SearchResponse, useSshKeys } from "@/hooks/use-ssh-keys"
import { GitBranchIcon, Key, KeyIcon, UsersIcon } from "lucide-react"
import React, { ComponentType, useState } from "react"


import { useDebounce } from 'use-debounce'


interface StatCardProps {
    label: string,
    count: number,
    Icon: ComponentType<{ className?: string }>,
}

function StatCard({label, Icon, count}: StatCardProps) {
    return <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-5 w-5 text-accent"/>
        <div className="text-left">
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-sm">{label}</p>
        </div>
    </div>
}

export function Home() {
    const [hasSearched, setHasSearched] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch] = useDebounce(searchQuery, 350)
    const {data, isFetched, isError, isLoading, refetch} = useSshKeys(debouncedSearch)

    const search = (s: string): void => {
        setHasSearched(true)
        setSearchQuery(s)
        refetch()
    }

    return (
        <Page>
            <div className="flex flex-col space-y-8 flex-grow justify-center items-center">
                <div className="max-w-2xl space-y-8 text-center">
                    <div className="space-y-2">
                        <Headline/>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                        <StatCard Icon={UsersIcon} label="Usernames" count={1264}/>
                        <div className="h-12 w-px bg-border"/>
                        <StatCard Icon={KeyIcon} label="Key indexed" count={1952}/>
                        <div className="h-12 w-px bg-border"/>
                        <StatCard Icon={GitBranchIcon} label="Platforms" count={1}/>
                    </div>
                    <div className="space-y-2">
                        <SearchBox search={search} searchIsLoading={isLoading}/>
                    </div>
                    <div className="space-y-2">
                        <ReassuringLine data={data}/>
                    </div>
                </div>
                {isError && (
                    <div className="w-full max-w-4xl">
                        <Card className="w-full border-border bg-card">
                            <CardContent className="py-12 text-center">
                                <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                                <p className="text-lg font-medium text-foreground">Oops something goes wrong.</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    <Button onClick={() => refetch()}>Retry</Button>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {isFetched && (
                    <div className="w-full max-w-4xl">
                        <SSHKeyResults searchQuery={searchQuery} data={data}/>
                    </div>
                )}
            </div>
        </Page>
    )
}

interface ReassuringLineProps {
    data?: SearchResponse | undefined
}

function ReassuringLine({data}: ReassuringLineProps) {
    return (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href="#" className={"border-dotted border-b-1"}>Fast Lookup</a>
                    </TooltipTrigger>
                    <TooltipContent side={"bottom"} className="max-w-sm text-left">
                        <div className="space-y-2 text-xs">
                            <div>
                                <p>
                                    <span className="font-bold">Last query duration: </span>
                                    <code
                                        className="mr-2">{data ? `${(data.duration / 1000000).toFixed(2)}ms` : "-"}</code>
                                </p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href="#" className={"border-dotted border-b-1"}>Advanced Search</a>
                    </TooltipTrigger>
                    <TooltipContent side={"bottom"} className="max-w-sm text-left">
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
                                <p><code className="mr-2">@textfield:merlin</code><span className="font-bold">text field search</span>
                                </p>
                                <p><code className="mr-2">@tagfield:{`{github|gitlab}`}</code><span
                                    className="font-bold"> tag field search</span></p>
                                <p><code className="mr-2">merl*</code><span
                                    className="font-bold"> wildcard search</span></p>
                                <p><code className="mr-2">&#34;merlindorin&#34;</code><span className="font-bold"> exact phrase</span>
                                </p>
                                <p><code className="mr-2">%typo%</code><span className="font-bold"> fuzzy search</span>
                                </p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"/>
                <span>Secure access</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href="#" className={"border-dotted border-b-1"}>Reverse Lookup</a>
                    </TooltipTrigger>
                    <TooltipContent side={"bottom"} className="max-w-sm text-left">
                        <div className="space-y-2 text-xs">
                            <div>
                                <p>
                                    <span className="font-semibold">Just search the key:</span>
                                </p>
                                <p><code className="mr-2">AAAAC3NzaC1lZD...</code></p>
                            </div>
                            <div>
                                <p className="font-semibold">And if you feel geeky</p>
                                <p><code className="mr-2">@key:{`{AAAAC3NzaC1lZD*}`}</code></p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
