"use client"

import { MobileMenu } from "components/templates/navbar/mobile-menu"
import { ModeToggle } from "@/components/molecules/mode-toggle"
import { type NavLinkProps, NavLinks } from "@/components/templates/navbar/nav-links"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavbarProps {
	links: NavLinkProps[]
	logoLink: NavLinkProps
}

export function Navbar({ links, logoLink }: NavbarProps) {
	return (
		<div className="fixed inset-x-0 top-(--fd-banner-height) z-40 flex items-center justify-between bg-fd-background/80 px-4 py-4 backdrop-blur-sm transition-colors">
			<div className="flex grow items-center gap-3">
				<NavLinks className="hidden gap-1 md:flex" links={[logoLink, ...links]} />
				<NavLinks className="flex gap-1 md:hidden" links={[logoLink]} />
			</div>
			<div className="hidden items-center gap-3 md:flex">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button>Signup</Button>
					</TooltipTrigger>
					<TooltipContent className="max-w-sm text-left" side={"bottom"}>
						Soon 🌟
					</TooltipContent>
				</Tooltip>
				<ModeToggle />
			</div>
			<div className="flex items-center gap-3 md:hidden">
				<MobileMenu links={links} />
			</div>
		</div>
	)
}
