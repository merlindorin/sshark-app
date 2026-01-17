"use client"

import { SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs"
import { MobileMenu } from "components/templates/navbar/mobile-menu"
import type { PropsWithChildren } from "react"
import { Skeleton } from "@/components/atoms/skeleton"
import { ModeToggle } from "@/components/molecules/mode-toggle"
import { type NavLinkProps, NavLinks } from "@/components/templates/navbar/nav-links"
import { UserNav } from "@/components/templates/navbar/nav-user"
import { Button } from "@/components/ui/button"

interface NavbarProps {
	links: NavLinkProps[]
	logoLink: NavLinkProps
}

function NavbarContainer({ children }: PropsWithChildren) {
	return (
		<div className="border-b bg-fd-background/80 backdrop-blur-lg transition-colors *:mx-auto *:max-w-(--fd-layout-width)">
			<div className="position:relative">{children}</div>
		</div>
	)
}

export function Navbar({ links, logoLink }: NavbarProps) {
	const { isSignedIn, user, isLoaded } = useUser()
	const { signOut } = useAuth()

	return (
		<NavbarContainer>
			<nav className="flex h-14 w-full items-center px-4">
				<div className="flex grow">
					<NavLinks className="hidden md:flex" links={[logoLink, ...links]} />
					<NavLinks className="flex md:hidden" links={[logoLink]} />
				</div>
				<div className="hidden items-center md:flex">
					{!isLoaded && <Skeleton className="h-10 w-10 rounded-full" />}
					{isLoaded && isSignedIn && <UserNav className="h-10 w-10" signout={signOut} user={user} />}
					{isLoaded && !isSignedIn && <UnAuthenticatedNavbar />}
				</div>
				<div className="items-center md:hidden">
					<MobileMenu links={links} />
				</div>
			</nav>
		</NavbarContainer>
	)
}

function UnAuthenticatedNavbar(): React.JSX.Element {
	return (
		<div className="flex gap-2 xl:gap-4">
			<SignInButton>
				<Button variant="secondary">Signin</Button>
			</SignInButton>
			<SignUpButton>
				<Button>Signup</Button>
			</SignUpButton>
			<ModeToggle />
		</div>
	)
}
