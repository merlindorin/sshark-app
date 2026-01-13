"use client"

import {Box} from "@/components/atoms/box"
import {Flex} from "@/components/atoms/flex"
import {P} from "@/components/atoms/text"
import {SearchBox} from "@/components/molecules/search-box"
import {SSHKeyResults} from "@/components/ssh-key-result"
import {FAQ} from "@/components/templates/faq";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

import {type SearchResponse, useSshKeys} from "@/hooks/use-ssh-keys"
import {useStats} from "@/hooks/use-stats"
import {cn} from "@/lib/utils";
import {SiGithub, SiGitlab} from "@icons-pack/react-simple-icons";
import NumberFlow from "@number-flow/react"
import {GitBranchIcon, KeyIcon, UsersIcon} from "lucide-react"
import {ComponentProps, type ComponentType, useState} from "react"
import {useInterval} from "usehooks-ts"

interface StatCardProps {
    label: string
    count: number
    Icon: ComponentType<{ className?: string }>
}

function StatCard({label, Icon, count}: StatCardProps) {
    return (
        <Flex className="flex-col items-center text-left text-muted-foreground">
            <Flex className="items-center gap-2">
                <Icon className="size-5 text-accent"/>
                <P className="font-bold md:text-2xl">
                    <NumberFlow value={count}/>
                </P>
            </Flex>
            <P className="text-sm md:text-base">{label}</P>
        </Flex>
    )
}

function Stats({className}: ComponentProps<"div">) {
    const {data, refetch} = useStats()
    useInterval(refetch, 10_000)

    return (
        <div className={cn("flex items-center justify-center gap-4 md:gap-8", className)}>
            <StatCard count={data?.total_usernames || 0} Icon={UsersIcon} label="Usernames"/>
            <Box className="h-12 w-px bg-border"/>
            <StatCard count={data?.total_keys || 0} Icon={KeyIcon} label="Key indexed"/>
            <Box className="h-12 w-px bg-border"/>
            <StatCard count={data?.total_providers || 0} Icon={GitBranchIcon} label="Platforms"/>
        </div>
    )
}

export function Home() {
    const [searchQuery, setSearchQuery] = useState("")
    const [toSearchQuery, setToSearchQuery] = useState("")
    const {data, refetch, isError, isFetching} = useSshKeys(toSearchQuery)

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
        <main className="mt-(--fd-nav-height) w-full pt-4">
            <section
                className="relative mx-4 min-h-100 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
                <div className="relative z-10 py-12 md:py-24">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <a className="inline-block mb-4 group" href="/about">
                            <Badge className="px-3 py-1.5 text-sm font-medium " variant="secondary">
                                <span className="sm:inline">✨ Search across multiple platforms →</span>
                            </Badge>
                        </a>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Find
                            Public SSH Keys</h1>
                        <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold text-foreground">
                            Search for any user&apos;s public SSH keys or reverse lookup who owns a key. Quick,
                            secure,
                            and
                            developer-friendly.
                        </p>
                        <Stats className="mt-8"/>
                        <SearchBox className="mt-8" searchFn={search} searchQuery={searchQuery}
                                   setSearchQuery={setSearchQuery}/>
                        <ReassuringLine className="mt-8" data={data}/>
                    </div>
                    <div>
                        <SSHKeyResults
                            data={data}
                            searchFn={search}
                            searchIsError={isError}
                            searchIsFetching={isFetching}
                            searchQuery={toSearchQuery}
                        />
                    </div>
                </div>
            </section>
            <section className="container space-y-16 py-12 md:py-20">
                <h2 id="provider-heading" className="sr-only">
                    Browse SSH Keys per-provider
                </h2>
                <section className="space-y-6">
                    <header className="flex items-center justify-between">
                        <div><h3 id="category-platforms" className="mb-2 text-2xl font-bold tracking-tight">Browse by Platform</h3><p className="max-w-4xl text-sm text-muted-foreground sm:text-base">Explore SSH keys organized by platform. Quickly access keys from GitHub, GitLab, and other supported platforms.</p></div>
                    </header>
                    <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
                        <li>
                            <Card className="pt-0">
                                <CardContent
                                    className="relative aspect-16/10 overflow-hidden bg-[#F2F2F3] dark:bg-[#262529]">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <SiGithub className="" size={60}/>
                                    </div>
                                    <Badge className="absolute right-2 top-2">123,444 Keys</Badge>
                                </CardContent>
                                <CardFooter>
                                    Github
                                </CardFooter>
                            </Card>
                        </li>
                        <li>
                            <Card className="pt-0">
                                <CardContent
                                    className="relative aspect-16/10 overflow-hidden bg-[#F2F2F3] dark:bg-[#262529]">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <SiGitlab className="" size={60}/>
                                    </div>
                                    <Badge className="absolute right-2 top-2">13,444 Keys</Badge>
                                </CardContent>
                                <CardFooter>
                                    Gitlab
                                </CardFooter>
                            </Card>
                        </li>
                    </ul>
                </section>
                <div className="mx-auto max-w-350 px-4 md:px-6">
                    <section className="py-8 sm:py-12 md:py-16">
                        <div className="mx-auto px-4 max-w-3xl">
                            <header className="text-center mb-6 sm:mb-8 md:mb-10">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground max-w-2xl mx-auto">
                                    Everything you need to know about SSHark and searching public SSH keys.
                                </p>
                                <FAQ className="pt-8" />
                            </header>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}

interface ReassuringLineProps extends ComponentProps<"div"> {
    data?: SearchResponse | undefined
}

function FeatureDot() {
    return <Box className="h-2 w-2 rounded-full bg-accent"/>
}

function ReassuringLine({data, className, ...props}: ReassuringLineProps) {
    return (
        <div
            className={cn(className, "flex items-center justify-center gap-4 text-muted-foreground text-sm")} {...props}>
            <div className="flex items-center gap-2">
                <FeatureDot/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="border-b border-dotted border-accent-foreground cursor-pointer">Fast Lookup</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-left" side="bottom">
                        <p className="space-y-2 text-xs">
                            <span className="font-bold">Last query duration: </span>
                            <code className="mr-2">
                                {data ? `${(data.duration / 1_000_000).toFixed(2)}ms` : "-"}
                            </code>
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-2">
                <FeatureDot/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="border-b border-dotted border-accent-foreground cursor-pointer">Advanced Search</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-left" side="bottom">
                        <div className="space-y-2 text-xs">
                            <div>
                                <p className="font-semibold">Available Fields:</p>
                                <p className="text-muted-foreground">
                                    @username, @key, @source, @provider, @type, @comment, @id
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Query Syntax:</p>
                                <p>
                                    <code className="mr-2">merlin</code>
                                    <span className="font-bold">simple search</span>
                                </p>
                                <p>
                                    <code className="mr-2">@username:{"{merlindorin}"}</code>
                                    <span className="font-bold">exact match</span>
                                </p>
                                <p>
                                    <code className="mr-2">@username:{"{merl*}"}</code>
                                    <span className="font-bold">wildcard</span>
                                </p>
                                <p>
                                    <code className="mr-2">@source:{"{github|gitlab}"}</code>
                                    <span className="font-bold">multiple values</span>
                                </p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-2">
                <FeatureDot/>
                <span>Secure access</span>
            </div>
            <div className="flex items-center gap-2">
                <FeatureDot/>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="border-b border-dotted border-accent-foreground cursor-pointer">Reverse Lookup</span>
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
