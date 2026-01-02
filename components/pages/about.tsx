"use client"

import { Page, PageContent, PageHeader } from "@/components/pages/page"
import { ArrowRight, Globe, Key, Search, Zap } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function About() {
    return (
        <Page>
            <PageHeader
                title="About"
                description="Advanced public key management for developers and security professionals."
            />
            <PageContent>
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">What is sshark?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        sshark is a fast, indexed search engine for public SSH keys. It aggregates keys from
                        major platforms like GitHub, GitLab, and Bitbucket, enabling instant lookups by
                        username, key fingerprint, or even partial key content.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Whether you need to verify a colleague&apos;s SSH key, audit access across your
                        infrastructure, or simply explore the public key landscape, sshark provides the
                        tools you need.
                    </p>
                </div>
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Current Features</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Search className="h-6 w-6 text-accent"/>
                            </div>
                            <div>
                                <h3 className="font-medium">Fast Indexed Search</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sub-millisecond queries powered by Redis Search across millions of keys.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Key className="h-6 w-6 text-accent"/>
                            </div>
                            <div>
                                <h3 className="font-medium">Reverse Lookup</h3>
                                <p className="text-sm text-muted-foreground">
                                    Find the owner of any SSH key by searching with the key content itself.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Globe className="h-6 w-6 text-accent"/>
                            </div>
                            <div>
                                <h3 className="font-medium">Multi-Platform</h3>
                                <p className="text-sm text-muted-foreground">
                                    Aggregates keys from GitHub, GitLab, Bitbucket, and more.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Zap className="h-6 w-6 text-accent"/>
                            </div>
                            <div>
                                <h3 className="font-medium">Advanced Query Syntax</h3>
                                <p className="text-sm text-muted-foreground">
                                    Wildcards, fuzzy matching, field-specific searches, and tag filters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 pt-4">
                    <Link
                        href="/docs"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Read the docs <ArrowRight className="h-4 w-4"/>
                    </Link>
                    <Link
                        href="/roadmap"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        View roadmap <ArrowRight className="h-4 w-4"/>
                    </Link>
                </div>
            </PageContent>
        </Page>
    )
}
