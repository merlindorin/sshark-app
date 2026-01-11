"use client"

import { SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs"
import { MobileMenu } from "components/templates/navbar/mobile-menu"
import type { PropsWithChildren } from "react"
import { Flex } from "@/components/atoms/flex"
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
		<Flex className="fixed inset-x-0 top-(--fd-banner-height) z-40 items-center bg-fd-background/80 px-4 py-4 backdrop-blur-sm transition-colors">
			{children}
		</Flex>
	)
}

export function Navbar({ links, logoLink }: NavbarProps) {
	const { isSignedIn, user, isLoaded } = useUser()
	const { signOut } = useAuth()

	return (
		<NavbarContainer>
			<Flex className="grow">
				<NavLinks className="hidden md:flex" links={[logoLink, ...links]} />
				<NavLinks className="flex md:hidden" links={[logoLink]} />
			</Flex>
			<Flex className="hidden items-center md:flex">
				{!isLoaded && <Skeleton className="h-10 w-10 rounded-full" />}
				{isLoaded && isSignedIn && <UserNav className="h-10 w-10" signout={signOut} user={user} />}
				{isLoaded && !isSignedIn && <UnAuthenticatedNavbar />}
			</Flex>
			<Flex className="items-center md:hidden">
				<MobileMenu links={links} />
			</Flex>
		</NavbarContainer>
	)
}

function UnAuthenticatedNavbar(): React.JSX.Element {
	return (
		<Flex className="gap-2">
			<SignInButton>
				<Button variant="secondary">Signin</Button>
			</SignInButton>
			<SignUpButton>
				<Button>Signup</Button>
			</SignUpButton>
			<ModeToggle />
		</Flex>
	)
}
