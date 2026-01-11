import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { Flex } from "@/components/atoms/flex"
import type { NavLinkProps } from "@/components/templates/navbar/nav-links"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

interface MobileMenuProps {
	links: NavLinkProps[]
}

export const MobileMenu = ({ links }: MobileMenuProps) => (
	<Drawer>
		<DrawerTrigger asChild>
			<Button className="size-8" size="icon" variant="ghost">
				<MenuIcon size={16} />
			</Button>
		</DrawerTrigger>
		<DrawerContent>
			<DrawerHeader className="sr-only">
				<DrawerTitle>Mobile Menu</DrawerTitle>
			</DrawerHeader>
			<Flex className="flex-col space-y-4 overflow-y-auto px-6 pt-8 pb-12">
				<Flex className="flex-col gap-2">
					{links.map(({ href, label, ...props }) => (
						<DrawerClose asChild key={label}>
							<Link className="text-muted-foreground" href={href} key={label} {...props}>
								{label}
							</Link>
						</DrawerClose>
					))}
				</Flex>
			</Flex>
		</DrawerContent>
	</Drawer>
)
