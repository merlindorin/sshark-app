"use client"

import { type JSX, type PropsWithChildren, useState } from "react"

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
		<footer className="group mx-auto flex w-full items-center justify-center gap-1 border-t px-6 py-4 text-muted-foreground text-sm">
			{children}
		</footer>
	)
}

export function Footer() {
	return (
		<FooterContainer>
			<Swapper altChildren={<span>haters &gt; /dev/null™</span>}>
				<div className="flex gap-1">
					<span>Created with</span>
					<span className="grayscale transition-all group-hover:scale-125 group-hover:animate-pulse group-hover:grayscale-0">
						❤️
					</span>
					<span>by</span>
					<span
						className="font-medium text-foreground transition-colors hover:text-accent"
						onClick={(e) => {
							e.stopPropagation()
							open("https://github.com/merlindorin")
						}}>
						@merlindorin
					</span>
				</div>
			</Swapper>
		</FooterContainer>
	)
}
