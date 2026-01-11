import { cn } from "@/lib/utils"
import { Box, type BoxProps, type ResponsiveValue, resolveResponsive } from "./box"

const directionValues = {
	row: "flex-row",
	col: "flex-col",
	rowReverse: "flex-row-reverse",
	colReverse: "flex-col-reverse",
} as const

const justifyValues = {
	start: "justify-start",
	end: "justify-end",
	center: "justify-center",
	between: "justify-between",
	around: "justify-around",
	evenly: "justify-evenly",
} as const

const alignValues = {
	start: "items-start",
	end: "items-end",
	center: "items-center",
	baseline: "items-baseline",
	stretch: "items-stretch",
} as const

const wrapValues = {
	wrap: "flex-wrap",
	nowrap: "flex-nowrap",
	wrapReverse: "flex-wrap-reverse",
} as const

const gapValues = {
	0: "gap-0",
	1: "gap-1",
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	5: "gap-5",
	6: "gap-6",
	8: "gap-8",
	10: "gap-10",
	12: "gap-12",
} as const

const growValues = {
	true: "grow",
	false: "grow-0",
} as const

const shrinkValues = {
	true: "shrink",
	false: "shrink-0",
} as const

const inlineValues = {
	true: "inline-flex",
	false: "flex",
} as const

type Direction = keyof typeof directionValues
type Justify = keyof typeof justifyValues
type Align = keyof typeof alignValues
type Wrap = keyof typeof wrapValues
type Gap = keyof typeof gapValues
type Grow = keyof typeof growValues
type Shrink = keyof typeof shrinkValues
type Inline = keyof typeof inlineValues

export interface FlexProps extends BoxProps {
	direction?: ResponsiveValue<Direction>
	justify?: ResponsiveValue<Justify>
	align?: ResponsiveValue<Align>
	wrap?: ResponsiveValue<Wrap>
	gap?: ResponsiveValue<Gap>
	grow?: ResponsiveValue<Grow>
	shrink?: ResponsiveValue<Shrink>
	inline?: ResponsiveValue<Inline>
}

export function Flex({
	className,
	display,
	direction,
	justify,
	align,
	wrap,
	gap,
	grow,
	shrink,
	inline,
	...props
}: FlexProps) {
	const flexClasses = cn(
		// Only add default "flex" if no display prop is provided
		!display && "flex",
		...resolveResponsive(direction, directionValues),
		...resolveResponsive(justify, justifyValues),
		...resolveResponsive(align, alignValues),
		...resolveResponsive(wrap, wrapValues),
		...resolveResponsive(gap, gapValues),
		...resolveResponsive(grow, growValues),
		...resolveResponsive(shrink, shrinkValues),
		...resolveResponsive(inline, inlineValues),
		className,
	)

	return <Box className={flexClasses} display={display} {...props} />
}
