"use client"

import type { LinkProps } from "next/dist/client/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps, PropsWithChildren } from "react"
import { Flex } from "@/components/atoms/flex"
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
		<Flex className={cn("items-center gap-1", className)} {...props}>
			{links.map(({ children, label, href, ...linkProps }) => (
				<Link
					className={cn(
						navigationMenuTriggerStyle(),
						"h-10 bg-transparent px-3 py-1.5 shadow-none transition-all",
						pathname === href && "bg-primary/10 text-primary",
					)}
					href={href}
					key={label}
					{...linkProps}>
					{children || label}
				</Link>
			))}
		</Flex>
	)
}
