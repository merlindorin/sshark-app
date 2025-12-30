"use client"

import {Header} from "@/components/templates/Header"
import {Footer} from "@/components/pages/Footer"
import Link from "next/link"

export default function Roadmap() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header/>
            <main className="container flex grow mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Roadmap</h1>
                        <p className="text-xl text-muted-foreground">
                            Our vision extends to comprehensive public/private key management across all
                            cryptographic key types. Here&apos;s what we&apos;re working on:
                        </p>
                        <div className="border-b border-dotted border-foreground/50 pt-4"></div>
                    </div>

                    <ol className="space-y-6">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">0</span>
                            <div>
                                <div>
                                    <span className="font-medium">Be present online with an MVP</span>
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">Done</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">Launch a working prototype to gather feedback and validate the concept.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-medium">1</span>
                            <div>
                                <div>
                                    <span className="font-medium">Fast, resilient and bullet-proof search engine</span>
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">WIP</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">Optimize query performance, add caching, and ensure high availability under load.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm font-medium">2</span>
                            <div>
                                <span className="font-medium text-muted-foreground">Provide public MCP server</span>
                                <p className="text-sm text-muted-foreground mt-1">Expose sshark as an MCP server for seamless integration with AI assistants and tools.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm font-medium">3</span>
                            <div>
                                <span className="font-medium text-muted-foreground">Add more providers</span>
                                <p className="text-sm text-muted-foreground mt-1">Expand coverage to GitLab, Bitbucket, and other popular code hosting platforms.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm font-medium">4</span>
                            <div>
                                <span className="font-medium text-muted-foreground">Periodically refetch public keys</span>
                                <p className="text-sm text-muted-foreground mt-1">Keep the index fresh by automatically syncing keys on a regular schedule.</p>
                            </div>
                        </li>
                    </ol>

                    <div className="space-y-4">
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
                            Have suggestions? <Link href="https://github.com/merlindorin" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Get in touch</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
