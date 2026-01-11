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
		<Flex
			align="center"
			className="top-(--fd-banner-height) bg-fd-background/80 backdrop-blur-sm transition-colors"
			insetX={0}
			position="fixed"
			px={4}
			py={4}
			z-index={40}>
			{children}
		</Flex>
	)
}

export function Navbar({ links, logoLink }: NavbarProps) {
	const { isSignedIn, user, isLoaded } = useUser()
	const { signOut } = useAuth()

	return (
		<NavbarContainer>
			<Flex grow={"true"}>
				<NavLinks display={{ default: "hidden", md: "flex" }} links={[logoLink, ...links]} />
				<NavLinks display={{ default: "flex", md: "hidden" }} links={[logoLink]} />
			</Flex>
			<Flex align="center" display={{ default: "hidden", md: "flex" }}>
				{!isLoaded && <Skeleton h={10} rounded={"full"} w={10} />}
				{isLoaded && isSignedIn && <UserNav className="h-10 w-10" signout={signOut} user={user} />}
				{isLoaded && !isSignedIn && <UnAuthenticatedNavbar />}
			</Flex>
			<Flex align="center" display={{ md: "hidden" }}>
				<MobileMenu links={links} />
			</Flex>
		</NavbarContainer>
	)
}

function UnAuthenticatedNavbar(): React.JSX.Element {
	return (
		<Flex gap={2}>
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
