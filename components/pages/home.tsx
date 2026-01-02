"use client"

import { SearchBox } from "@/components/molecules/SearchBox"
import Headline from "@/components/pages/Headline"
import { SSHKeyResults } from "@/components/ssh-key-result"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SearchResponse, useSshKeys } from "@/hooks/use-ssh-keys"

import { GitBranchIcon, Key, Users } from "lucide-react"
import { useState } from "react"


import { useDebounce } from 'use-debounce'


export function Home() {
    const [hasSearched, setHasSearched] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch] = useDebounce(searchQuery, 350)
    const {data, isLoading, refetch} = useSshKeys(debouncedSearch)

    const search = (s: string): void => {
        setHasSearched(true)
        setSearchQuery(s)
        refetch()
    }

    return (
        <main className="container flex grow mx-auto px-6 py-12">
            <div className="flex mx-auto justify-center flex-col items-center gap-12">
                <div className="w-full max-w-2xl space-y-8 text-center">
                    <div className="space-y-2">
                        <Headline/>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-5 w-5 text-accent"/>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{123}</p>
                                <p className="text-sm">Usernames</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-border"/>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Key className="h-5 w-5 text-accent"/>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{1239}</p>
                                <p className="text-sm">Key indexed</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-border"/>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <GitBranchIcon className="h-5 w-5 text-accent"/>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{3}</p>
                                <p className="text-sm">Platforms</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <SearchBox
                            search={search}
                            searchIsLoading={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <ReassuringLine data={data}/>
                    </div>
                </div>
                {hasSearched && (
                    <div className="w-full max-w-4xl">
                        <SSHKeyResults searchQuery={searchQuery} data={data}/>
                    </div>
                )}
            </div>
        </main>
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
                                <p className="text-muted-foreground">@id, @key, @username, @title, @comment,
                                    @created_at</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tag Fields:</p>
                                <p className="text-muted-foreground">@source{`{github|gitlab|bitbucket|manual}`}</p>
                                <p className="text-muted-foreground">@type{`{ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256}`}</p>
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
                                <p><code className="mr-2">@key:AAAAC3NzaC1lZD...</code></p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
