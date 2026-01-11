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
			as="footer"
			className="group mx-auto w-full items-center justify-center gap-1 border-t px-6 py-4 text-muted-foreground text-sm">
			{children}
		</Flex>
	)
}

export function Footer() {
	return (
		<FooterContainer>
			<Swapper altChildren={<Span>haters &gt; /dev/null™</Span>}>
				<Flex className="gap-1">
					<Span>Created with</Span>
					<Span className="grayscale transition-all group-hover:scale-125 group-hover:animate-pulse group-hover:grayscale-0">
						❤️
					</Span>
					<Span>by</Span>
					<Span
						className="font-medium text-foreground transition-colors hover:text-accent"
						onClick={(e) => {
							e.stopPropagation()
							open("https://github.com/merlindorin")
						}}>
						@merlindorin
					</Span>
				</Flex>
			</Swapper>
		</FooterContainer>
	)
}
