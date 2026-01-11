import type { ComponentProps } from "react"
import { Box, type BoxProps } from "./box"

type UlProps = Omit<BoxProps, "as"> & Omit<ComponentProps<"ul">, keyof BoxProps>
type OlProps = Omit<BoxProps, "as"> & Omit<ComponentProps<"ol">, keyof BoxProps>
type LiProps = Omit<BoxProps, "as"> & Omit<ComponentProps<"li">, keyof BoxProps>

export function Ul(props: UlProps) {
	return <Box as="ul" {...props} />
}

export function Ol(props: OlProps) {
	return <Box as="ol" {...props} />
}

export function Li(props: LiProps) {
	return <Box as="li" {...props} />
}
