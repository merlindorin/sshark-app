import type { ComponentProps } from "react"
import { Box, type BoxProps } from "./box"

type TextElement = "p" | "span" | "div" | "label"
type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

interface TextProps extends Omit<BoxProps, "as"> {
	as?: TextElement
}

interface HeadingProps extends Omit<BoxProps, "as"> {
	as?: HeadingElement
}

type PProps = Omit<TextProps, "as"> & Omit<ComponentProps<"p">, keyof BoxProps>
type SpanProps = Omit<TextProps, "as"> & Omit<ComponentProps<"span">, keyof BoxProps>
type H1Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h1">, keyof BoxProps>
type H2Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h2">, keyof BoxProps>
type H3Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h3">, keyof BoxProps>
type H4Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h4">, keyof BoxProps>
type H5Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h5">, keyof BoxProps>
type H6Props = Omit<HeadingProps, "as"> & Omit<ComponentProps<"h6">, keyof BoxProps>

export function Text({ as = "p", ...props }: TextProps) {
	return <Box as={as as BoxProps["as"]} {...props} />
}

export function Heading({ as = "h2", ...props }: HeadingProps) {
	return <Box as={as as BoxProps["as"]} {...props} />
}

export function P(props: PProps) {
	return <Text as="p" {...props} />
}

export function Span(props: SpanProps) {
	return <Text as="span" {...props} />
}

export function H1(props: H1Props) {
	return <Heading as="h1" {...props} />
}

export function H2(props: H2Props) {
	return <Heading as="h2" {...props} />
}

export function H3(props: H3Props) {
	return <Heading as="h3" {...props} />
}

export function H4(props: H4Props) {
	return <Heading as="h4" {...props} />
}

export function H5(props: H5Props) {
	return <Heading as="h5" {...props} />
}

export function H6(props: H6Props) {
	return <Heading as="h6" {...props} />
}
