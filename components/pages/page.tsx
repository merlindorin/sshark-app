import type React from "react"
import type { ComponentProps, PropsWithChildren } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function Page({ children, className, ...props }: React.PropsWithChildren & ComponentProps<"main">) {
	return (
		<main className={cn("mt-(--fd-nav-height) w-full", className)} {...props}>
			{children}
		</main>
	)
}

export function PageHeaderHero({ children, ...props }: PropsWithChildren & ComponentProps<"section">) {
	return (
		<PageSection {...props}>
			<div className="m-4 min-h-100 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:m-6">
				<div className="z-10 py-12 md:py-24">
					<div className="mx-auto max-w-3xl px-4 text-center">{children}</div>
				</div>
			</div>
		</PageSection>
	)
}

export function PageHeaderHeroBadge({ children, className, ...props }: PropsWithChildren & ComponentProps<"a">) {
	return (
		<a className={cn(className, "group mb-4 inline-block")} {...props}>
			<Badge className="px-3 py-1.5 font-medium text-sm" variant="secondary">
				<span className="sm:inline">{children}</span>
			</Badge>
		</a>
	)
}

export function PageHeaderHeroTitle({ children, className, ...props }: {} & PropsWithChildren & ComponentProps<"h1">) {
	return (
		<h1
			className={cn(className, "font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl")}
			{...props}>
			{children}
		</h1>
	)
}

export function PageHeaderHeroDescription({
	children,
	className,
	...props
}: {} & PropsWithChildren & ComponentProps<"p">) {
	return (
		<h1 className={cn(className, "mx-auto mt-6 max-w-2xl font-semibold text-foreground text-xl")} {...props}>
			{children}
		</h1>
	)
}

export function PageSection({
	divide = true,
	children,
	className,
	...props
}: { divide?: boolean } & PropsWithChildren & ComponentProps<"section">) {
	return (
		<section className={cn("p-6 md:p-12", divide && "border-t border-dashed", className)} {...props}>
			<div className="w-full space-x-6 space-y-6">{children}</div>
		</section>
	)
}

export function PageSectionHeader({ children, ...props }: PropsWithChildren & ComponentProps<"header">) {
	return <header {...props}>{children}</header>
}

export function PageSectionContent({ children, ...props }: PropsWithChildren & ComponentProps<"div">) {
	return <div {...props}>{children}</div>
}

export function PageSectionSRTitle({
	children,
	...props
}: { divide?: boolean } & PropsWithChildren & ComponentProps<"h2">) {
	return (
		<h2 className="sr-only" {...props}>
			{children}
		</h2>
	)
}

export function PageSectionTitle({
	children,
	...props
}: { divide?: boolean } & PropsWithChildren & ComponentProps<"h3">) {
	return (
		<h2 className="mb-2 font-bold text-2xl tracking-tight" {...props}>
			{children}
		</h2>
	)
}

export function PageSectionParagraph({
	children,
	...props
}: { divide?: boolean } & PropsWithChildren & ComponentProps<"p">) {
	return (
		<p className="max-w-4xl text-muted-foreground text-sm sm:text-base" {...props}>
			{children}
		</p>
	)
}
