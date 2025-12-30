"use client"

import {Header} from "@/components/templates/Header"
import {Footer} from "@/components/pages/Footer"

export default function Docs() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header/>
            <main className="container flex grow mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
                        <p className="text-xl text-muted-foreground">
                            Learn how to search and query SSH keys effectively.
                        </p>
                        <div className="border-b border-dotted border-foreground/50 pt-4"></div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Basic Search</h2>
                        <p className="text-muted-foreground">
                            Simply type a username to find their public SSH keys:
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                            merlindorin
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Field-Specific Search</h2>
                        <p className="text-muted-foreground">
                            Use field prefixes to search specific attributes:
                        </p>
                        <div className="space-y-3">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@username:merlindorin</code>
                                <p className="text-sm text-muted-foreground mt-2">Search by username</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@key:AAAAC3NzaC1lZD...</code>
                                <p className="text-sm text-muted-foreground mt-2">Reverse lookup by key content</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@title:laptop</code>
                                <p className="text-sm text-muted-foreground mt-2">Search by key title/name</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@comment:work</code>
                                <p className="text-sm text-muted-foreground mt-2">Search in key comments</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Available Fields</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="font-medium">Text Fields</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li><code className="bg-muted px-1 rounded">@id</code> - Key identifier</li>
                                    <li><code className="bg-muted px-1 rounded">@key</code> - Key content</li>
                                    <li><code className="bg-muted px-1 rounded">@username</code> - Owner username</li>
                                    <li><code className="bg-muted px-1 rounded">@title</code> - Key title</li>
                                    <li><code className="bg-muted px-1 rounded">@comment</code> - Key comment</li>
                                    <li><code className="bg-muted px-1 rounded">@created_at</code> - Creation date</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Tag Fields</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li><code className="bg-muted px-1 rounded">@source</code> - github, gitlab, bitbucket</li>
                                    <li><code className="bg-muted px-1 rounded">@type</code> - ssh-rsa, ssh-ed25519, ecdsa-sha2-nistp256</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Tag Filters</h2>
                        <p className="text-muted-foreground">
                            Filter by source platform or key type:
                        </p>
                        <div className="space-y-3">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@source:{`{github}`}</code>
                                <p className="text-sm text-muted-foreground mt-2">Only keys from GitHub</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@source:{`{github|gitlab}`}</code>
                                <p className="text-sm text-muted-foreground mt-2">Keys from GitHub or GitLab</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">@type:{`{ssh-ed25519}`}</code>
                                <p className="text-sm text-muted-foreground mt-2">Only Ed25519 keys</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Advanced Patterns</h2>
                        <div className="space-y-3">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">merl*</code>
                                <p className="text-sm text-muted-foreground mt-2">Wildcard search - matches merlindorin, merlin, etc.</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">&quot;merlindorin&quot;</code>
                                <p className="text-sm text-muted-foreground mt-2">Exact phrase match</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <code className="font-mono text-sm">%typo%</code>
                                <p className="text-sm text-muted-foreground mt-2">Fuzzy search - tolerates typos</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Reverse Lookup</h2>
                        <p className="text-muted-foreground">
                            Have a key and want to find who owns it? Just paste the key content directly in the search box:
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <code className="font-mono text-sm break-all">AAAAC3NzaC1lZDI1NTE5AAAAI...</code>
                            <p className="text-sm text-muted-foreground mt-2">Paste any part of the public key to find its owner</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
