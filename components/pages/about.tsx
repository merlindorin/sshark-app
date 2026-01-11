"use client"

import { ArrowRight, Globe, Key, Search, Zap } from "lucide-react"
import Link from "next/link"
import type { ComponentType } from "react"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { H2, H3, P } from "@/components/atoms/text"
import { Page, PageContent, PageHeaderHero } from "@/components/pages/page"

interface FeatureCardProps {
	Icon: ComponentType<{ className?: string }>
	title: string
	description: string
}

function FeatureCard({ Icon, title, description }: FeatureCardProps) {
	return (
		<Flex gap={4}>
			<Box shrink="false">
				<Icon className="h-6 w-6 text-accent" />
			</Box>
			<Box>
				<H3 fontWeight="medium">{title}</H3>
				<P textColor="muted-foreground" textSize="sm">
					{description}
				</P>
			</Box>
		</Flex>
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
				<Box spaceY={6}>
					<H2 fontWeight="semibold" textSize="2xl">
						What is sshark?
					</H2>
					<P className="leading-relaxed" textColor="muted-foreground">
						sshark is a fast, indexed search engine for public SSH keys. It aggregates keys from major
						platforms like GitHub, GitLab, and Bitbucket, enabling instant lookups by username, key
						fingerprint, or even partial key content.
					</P>
					<P className="leading-relaxed" textColor="muted-foreground">
						Whether you need to verify a colleague&apos;s SSH key, audit access across your infrastructure,
						or simply explore the public key landscape, sshark provides the tools you need.
					</P>
				</Box>

				<Box spaceY={6}>
					<H2 fontWeight="semibold" textSize="2xl">
						Current Features
					</H2>
					<Box className="grid gap-6 sm:grid-cols-2">
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
					</Box>
				</Box>

				<Flex gap={6} pt={4}>
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
				</Flex>
			</PageContent>
		</Page>
	)
}
