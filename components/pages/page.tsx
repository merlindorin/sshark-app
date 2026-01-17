import type React from "react"
import type { ComponentProps, PropsWithChildren } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function Page({ children, className, ...props }: React.PropsWithChildren & ComponentProps<"main">) {
	return (
		<main className={cn("mt-(--fd-nav-height) w-full pt-4", className)} {...props}>
			{children}
		</main>
	)
}

interface PageHeaderHeroProps {
	title: string
	description?: string
	badge?: {
		label: string
		href?: string
	}
}

export function PageHeaderHero({ title, description, badge }: PageHeaderHeroProps) {
	return (
		<section className="relative mx-4 min-h-100 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
			<div className="relative z-10 py-12 md:py-24">
				<div className="mx-auto max-w-3xl px-4 text-center">
					{badge && (
						<a className="group mb-4 inline-block" href={badge.href || "#"}>
							<Badge className="px-3 py-1.5 font-medium text-sm" variant="secondary">
								<span className="sm:inline">{badge.label}</span>
							</Badge>
						</a>
					)}
					<h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
						{title}
					</h1>
					{description && (
						<p className="mx-auto mt-6 max-w-2xl font-semibold text-foreground text-xl">{description}</p>
					)}
				</div>
			</div>
		</section>
	)
}

export function PageContent({ children, className }: PropsWithChildren & ComponentProps<"div">) {
	return <div className={cn("container space-y-16 py-12 md:py-20", className)}>{children}</div>
}
