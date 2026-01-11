"use client"

import type { UserResource } from "@clerk/types"
import type { VariantProps } from "class-variance-authority"
import { LogOut } from "lucide-react"
import type * as React from "react"
import { Flex } from "@/components/atoms/flex"
import { P } from "@/components/atoms/text"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, type buttonVariants } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface UserNavProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	user?: UserResource
	signout?: () => void
}

export function UserNav({ user, signout, className, ...props }: UserNavProps) {
	const getInitials = (name: string | null) => {
		if (!name) {
			return ""
		}

		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className={cn("rounded-full p-0", className)} variant="ghost" {...props}>
					<Avatar className="h-full w-full">
						<AvatarImage src={user?.imageUrl} />
						<AvatarFallback>{user ? getInitials(user?.username) : "U"}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56" forceMount>
				<DropdownMenuLabel className="font-normal">
					<Flex className="flex-col space-y-1">
						<P className="font-medium text-sm leading-none">{user?.username || "User"}</P>
						<P className="text-muted-foreground text-xs leading-none">
							{user?.primaryEmailAddress?.emailAddress || ""}
						</P>
					</Flex>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={signout}>
					<LogOut className="mr-2 h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
