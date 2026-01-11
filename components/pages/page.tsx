import type React from "react"
import type { PropsWithChildren } from "react"
import { Box } from "@/components/atoms/box"
import { Flex } from "@/components/atoms/flex"
import { H1, P } from "@/components/atoms/text"
import { cn } from "@/lib/utils"

export function Page({ children }: React.PropsWithChildren) {
	return (
		<Flex
			as="main"
			className="container mx-auto mt-12 max-w-3xl grow flex-col justify-center space-y-8 px-0 py-12 md:px-6">
			{children}
		</Flex>
	)
}

export function PageHeader({ children, className }: { className?: string } & PropsWithChildren) {
	return <Flex className={cn("flex-col gap-8 px-6", className)}>{children}</Flex>
}

export function PageHeaderHero({ title, description }: { title: string; description?: string; className?: string }) {
	return (
		<PageHeader>
			<Box>
				<H1 className="font-bold text-4xl tracking-tight">{title}</H1>
				<P className="pt-2 text-muted-foreground text-xl">{description}</P>
			</Box>
			<Box className="border-foreground/50 border-b border-dotted" />
		</PageHeader>
	)
}

export function PageContent({ children }: PropsWithChildren) {
	return <Flex className="flex-col gap-8 px-6">{children}</Flex>
}
