import type { PropsWithChildren } from "react"
import { Box } from "@/components/atoms/box"
import { H1, P } from "@/components/atoms/text"

function SubTitle({ children }: PropsWithChildren) {
	return <P className="text-balance text-lg text-muted-foreground">{children}</P>
}

function MainTitle({ children }: PropsWithChildren) {
	return <H1 className="text-balance font-bold text-5xl text-foreground tracking-tight sm:text-6xl">{children}</H1>
}

export default function Headline() {
	return (
		<Box>
			<MainTitle>Find Public SSH Keys</MainTitle>
			<SubTitle>
				Search for any user&apos;s public SSH keys or reverse lookup who owns a key. Quick, secure, and
				developer-friendly.
			</SubTitle>
		</Box>
	)
}
