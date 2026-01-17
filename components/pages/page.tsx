import type React from "react"
import type { ComponentProps, PropsWithChildren } from "react"
import { Box } from "@/components/atoms/box"
import { cn } from "@/lib/utils"

export function Page({ children, className, ...props }: React.PropsWithChildren & ComponentProps<"main">) {
	return (
		<main
			className={cn(
				"container mx-auto mt-12 flex max-w-3xl grow flex-col justify-center space-y-8 px-0 py-12 md:px-6 xl:max-w-6xl",
				className,
			)}
			{...props}>
			{children}
		</main>
	)
}

export function HomeHeader({ children, className }: PropsWithChildren & ComponentProps<"div">) {
	return <div className={cn("mx-auto max-w-3xl px-4 text-center", className)}>{children}</div>
}

export function PageHeaderHero({ title, description }: { title: string; description?: string; className?: string }) {
	return (
		<HomeHeader>
			<div>
				<h1 className="font-bold text-4xl tracking-tight">{title}</h1>
				<p className="pt-2 text-muted-foreground text-xl">{description}</p>
			</div>
			<Box className="border-foreground/50 border-b border-dotted" />
		</HomeHeader>
	)
}

export function PageContent({ children }: PropsWithChildren) {
	return (
		<div className="mx-auto h-full w-full max-w-350 border-dashed p-4 sm:p-8 min-[1800px]:max-w-384 min-[1400px]:border-x">
			<div className="mt-(--fd-nav-height) w-full pt-4">{children}</div>
		</div>
	)
}
