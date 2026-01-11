import type { PropsWithChildren } from "react"
import { Box } from "@/components/atoms/box"
import { H1, P } from "@/components/atoms/text"

function SubTitle({ children }: PropsWithChildren) {
	return (
		<P textColor="muted-foreground" textSize="lg" textWrap="balance">
			{children}
		</P>
	)
}

function MainTitle({ children }: PropsWithChildren) {
	return (
		<H1
			className="tracking-tight"
			fontWeight="bold"
			textColor="foreground"
			textSize={{ default: "5xl", sm: "6xl" }}
			textWrap="balance">
			{children}
		</H1>
	)
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
