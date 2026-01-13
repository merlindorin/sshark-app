"use client"

import { Database, GitBranch, Key, Search } from "lucide-react"
import type { ComponentType } from "react"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { H3, P } from "@/components/atoms/text"
import { Page, PageContent, PageHeaderHero } from "@/components/pages/page"
import { Card, CardContent } from "@/components/ui/card"
import { SiGithub, SiGitlab } from "@icons-pack/react-simple-icons"

interface StatCardProps {
	Icon: ComponentType<{ className?: string; size?: number }>
	label: string
	description: string
	platform?: boolean
}

function ExploreCard({ Icon, label, description, platform = false }: StatCardProps) {
	return (
		<Card className="transition-all hover:shadow-md hover:border-accent">
			<CardContent className="p-6">
				<Flex className="gap-4 items-start">
					<Box className="shrink-0">
						{platform ? (
							<Icon className="text-foreground" size={32} />
						) : (
							<Icon className="h-8 w-8 text-accent" />
						)}
					</Box>
					<Box>
						<H3 className="font-semibold mb-2">{label}</H3>
						<P className="text-muted-foreground text-sm leading-relaxed">{description}</P>
					</Box>
				</Flex>
			</CardContent>
		</Card>
	)
}

export default function Explore() {
	return (
		<Page>
			<PageHeaderHero
				description="Discover and search through indexed SSH keys from multiple platforms."
				title="Explore SSH Keys"
			/>
			<PageContent>
				<Box className="space-y-8">
					<Box className="space-y-4">
						<H3 className="font-semibold text-xl">Browse by Platform</H3>
						<Box className="grid gap-4 sm:grid-cols-2">
							<ExploreCard
								description="Search through SSH keys indexed from GitHub users and organizations."
								Icon={SiGithub}
								label="GitHub"
								platform
							/>
							<ExploreCard
								description="Explore SSH keys from GitLab users and groups."
								Icon={SiGitlab}
								label="GitLab"
								platform
							/>
						</Box>
					</Box>

					<Box className="space-y-4">
						<H3 className="font-semibold text-xl">Explore by Category</H3>
						<Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<ExploreCard
								description="Browse keys by encryption type: RSA, Ed25519, ECDSA, and more."
								Icon={Key}
								label="Key Types"
							/>
							<ExploreCard
								description="Discover the most common SSH key formats and algorithms."
								Icon={Database}
								label="Popular Keys"
							/>
							<ExploreCard
								description="View statistics and insights about indexed SSH keys."
								Icon={GitBranch}
								label="Statistics"
							/>
						</Box>
					</Box>

					<Box className="rounded-lg border border-dashed p-8 text-center">
						<Flex className="flex-col items-center gap-4">
							<Search className="h-12 w-12 text-muted-foreground" />
							<Box>
								<H3 className="font-semibold mb-2">Advanced Search Coming Soon</H3>
								<P className="text-muted-foreground text-sm max-w-md mx-auto">
									Filter and explore SSH keys with advanced search capabilities. Search by username, key
									type, platform, and more.
								</P>
							</Box>
						</Flex>
					</Box>
				</Box>
			</PageContent>
		</Page>
	)
}
