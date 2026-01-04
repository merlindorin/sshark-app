import type React from "react"
import type { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

export function Page({ children }: React.PropsWithChildren) {
	return (
		<main className="container mx-auto mt-12 flex max-w-3xl grow flex-col space-y-8 py-12 md:px-6">{children}</main>
	)
}

export function PageHeader({ children, className }: { className?: string } & PropsWithChildren) {
	return <div className={cn("flex flex-col gap-8 px-6", className)}>{children}</div>
}

export function PageHeaderHero({ title, description }: { title: string; description?: string; className?: string }) {
	return (
		<PageHeader>
			<div>
				<h1 className="font-bold text-4xl tracking-tight">{title}</h1>
				<p className="pt-2 text-muted-foreground text-xl">{description}</p>
			</div>
			<div className="border-foreground/50 border-b border-dotted" />
		</PageHeader>
	)
}

export function PageContent({ children }: PropsWithChildren) {
	return <div className="flex flex-col gap-8 px-6">{children}</div>
}
