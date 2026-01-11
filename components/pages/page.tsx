import type React from "react"
import type { PropsWithChildren } from "react"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { H1, P } from "@/components/atoms/text"

export function Page({ children }: React.PropsWithChildren) {
	return (
		<Flex
			as="main"
			container={true}
			direction="col"
			maxW="3xl"
			mt={12}
			mx="auto"
			px={{ md: 6 }}
			py={12}
			spaceY={8}
		>
			{children}
		</Flex>
	)
}

export function PageHeader({ children, className }: { className?: string } & PropsWithChildren) {
	return (
		<Flex className={className} direction="col" gap={8} px={6}>
			{children}
		</Flex>
	)
}

export function PageHeaderHero({ title, description }: { title: string; description?: string; className?: string }) {
	return (
		<PageHeader>
			<Box>
				<H1 className="tracking-tight" fontWeight="bold" textSize="4xl">
					{title}
				</H1>
				<P pt={2} textColor="muted-foreground" textSize="xl">
					{description}
				</P>
			</Box>
			<Box borderB={1} borderStyle="dotted" className="border-foreground/50" />
		</PageHeader>
	)
}

export function PageContent({ children }: PropsWithChildren) {
	return (
		<Flex direction="col" gap={8} px={6}>
			{children}
		</Flex>
	)
}
