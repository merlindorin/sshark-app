"use client"

import type { LinkProps } from "next/dist/client/link"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"
import { Flex, type FlexProps } from "@/components/atoms/flex"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export type NavLinkProps = LinkProps &
	PropsWithChildren & {
		label: string
	}

export interface NavLinksProps extends FlexProps {
	links: NavLinkProps[]
}

export const NavLinks = ({ links, ...props }: NavLinksProps) => {
	const pathname = usePathname()

	return (
		<Flex align="center" gap={1} {...props}>
			{links.map(({ children, label, href, ...props }) => (
				<Link
					className={cn(
						navigationMenuTriggerStyle(),
						"h-10 bg-transparent px-3 py-1.5 shadow-none transition-all",
						pathname === href && "bg-primary/10 text-primary",
					)}
					href={href}
					key={label}
					{...props}>
					{children || label}
				</Link>
			))}
		</Flex>
	)
}
