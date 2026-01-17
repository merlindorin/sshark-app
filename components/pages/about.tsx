"use client"

import { ArrowRight, Globe, Key, Search, Zap } from "lucide-react"
import Link from "next/link"
import type { ComponentType } from "react"
import { Page, PageContent, PageHeaderHero } from "@/components/pages/page"

interface FeatureCardProps {
	Icon: ComponentType<{ className?: string }>
	title: string
	description: string
}

function FeatureCard({ Icon, title, description }: FeatureCardProps) {
	return (
		<div className="flex gap-4">
			<div className="shrink-0">
				<Icon className="h-6 w-6 text-accent" />
			</div>
			<div>
				<h3 className="font-medium">{title}</h3>
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	)
}

export default function About() {
	return (
		<Page>
			<PageHeaderHero
				description="Advanced public key management for developers and security professionals."
				title="About"
			/>
			<PageContent>
				<div className="space-y-6">
					<h2 className="font-semibold text-2xl">What is sshark?</h2>
					<p className="text-muted-foreground leading-relaxed">
						sshark is a fast, indexed search engine for public SSH keys. It aggregates keys from major
						platforms like GitHub, GitLab, and Bitbucket, enabling instant lookups by username, key
						fingerprint, or even partial key content.
					</p>
					<p className="text-muted-foreground leading-relaxed">
						Whether you need to verify a colleague&apos;s SSH key, audit access across your infrastructure,
						or simply explore the public key landscape, sshark provides the tools you need.
					</p>
				</div>

				<div className="space-y-6">
					<h2 className="font-semibold text-2xl">Current Features</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						<FeatureCard
							description="Sub-millisecond queries powered by Redis Search across millions of keys."
							Icon={Search}
							title="Fast Indexed Search"
						/>
						<FeatureCard
							description="Find the owner of any SSH key by searching with the key content itself."
							Icon={Key}
							title="Reverse Lookup"
						/>
						<FeatureCard
							description="Aggregates keys from GitHub, GitLab, Bitbucket, and more."
							Icon={Globe}
							title="Multi-Platform"
						/>
						<FeatureCard
							description="Wildcards, fuzzy matching, field-specific searches, and tag filters."
							Icon={Zap}
							title="Advanced Query Syntax"
						/>
					</div>
				</div>

				<div className="flex gap-6 pt-4">
					<Link
						className="flex items-center gap-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="/docs">
						Read the docs <ArrowRight className="h-4 w-4" />
					</Link>
					<Link
						className="flex items-center gap-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="/roadmap">
						View roadmap <ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</PageContent>
		</Page>
	)
}
