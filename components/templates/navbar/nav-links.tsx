"use client"

import type { LinkProps } from "next/dist/client/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps, PropsWithChildren } from "react"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export type NavLinkProps = LinkProps &
	PropsWithChildren & {
		label: string
	}

export interface NavLinksProps extends ComponentProps<"div"> {
	links: NavLinkProps[]
}

export const NavLinks = ({ links, className, ...props }: NavLinksProps) => {
	const pathname = usePathname()

	return (
		<div className={cn("flex gap-1", className)} {...props}>
			{links.map(({ children, label, href, ...linkProps }) => (
				<Link
					className={cn(navigationMenuTriggerStyle(), pathname === href && "bg-primary/10")}
					href={href}
					key={label}
					{...linkProps}>
					{children || label}
				</Link>
			))}
		</div>
	)
}
