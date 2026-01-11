"use client"

import { type JSX, type PropsWithChildren, useState } from "react"
import { Flex } from "@/components/atoms/flex"
import { Span } from "@/components/atoms/text"

interface SwapperProps extends PropsWithChildren {
	altChildren: JSX.Element
}

export function Swapper({ children, altChildren }: SwapperProps): JSX.Element {
	const [toggle, setToggle] = useState(true)
	return (
		<button className="cursor-pointer" onClick={() => setToggle(!toggle)} type="button">
			{toggle ? children : altChildren}
		</button>
	)
}

function FooterContainer({ children }: PropsWithChildren): JSX.Element {
	return (
		<Flex
			align="center"
			as={"footer"}
			borderT={1}
			gap={1}
			group={true}
			justify="center"
			mx="auto"
			px={6}
			py={4}
			textColor="muted-foreground"
			textSize="sm"
			w={"full"}>
			{children}
		</Flex>
	)
}

export function Footer() {
	return (
		<FooterContainer>
			<Swapper altChildren={<Span>haters &gt; /dev/null™</Span>}>
				<Flex gap={1}>
					<Span>Created with</Span>
					<Span className="grayscale transition-all group-hover:scale-125 group-hover:animate-pulse group-hover:grayscale-0">
						❤️
					</Span>
					<Span>by</Span>
					<Span
						className="transition-colors hover:text-accent"
						fontWeight="medium"
						onClick={(e) => {
							e.stopPropagation()
							open("https://github.com/merlindorin")
						}}
						textColor="foreground">
						@merlindorin
					</Span>
				</Flex>
			</Swapper>
		</FooterContainer>
	)
}
