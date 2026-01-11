import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const breakpoints = ["default", "sm", "md", "lg", "xl", "2xl"] as const
type Breakpoint = (typeof breakpoints)[number]

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

const displayValues = {
	block: "block",
	inline: "inline",
	inlineBlock: "inline-block",
	flex: "flex",
	inlineFlex: "inline-flex",
	hidden: "hidden",
	none: "hidden",
	grid: "grid",
	inlineGrid: "inline-grid",
	contents: "contents",
} as const

const textAlignValues = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
	justify: "text-justify",
	start: "text-start",
	end: "text-end",
} as const

const textSizeValues = {
	xs: "text-xs",
	sm: "text-sm",
	base: "text-base",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
	"4xl": "text-4xl",
	"5xl": "text-5xl",
	"6xl": "text-6xl",
	"7xl": "text-7xl",
	"8xl": "text-8xl",
	"9xl": "text-9xl",
} as const

const fontWeightValues = {
	thin: "font-thin",
	extralight: "font-extralight",
	light: "font-light",
	normal: "font-normal",
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold",
	extrabold: "font-extrabold",
	black: "font-black",
} as const

const textWrapValues = {
	wrap: "text-wrap",
	nowrap: "text-nowrap",
	balance: "text-balance",
	pretty: "text-pretty",
} as const

const growValues = {
	true: "grow",
	false: "grow-0",
} as const

const shrinkValues = {
	true: "shrink",
	false: "shrink-0",
} as const

const widthValues = {
	0: "w-0",
	1: "w-1",
	2: "w-2",
	3: "w-3",
	4: "w-4",
	5: "w-5",
	6: "w-6",
	8: "w-8",
	10: "w-10",
	12: "w-12",
	16: "w-16",
	20: "w-20",
	24: "w-24",
	32: "w-32",
	40: "w-40",
	48: "w-48",
	56: "w-56",
	64: "w-64",
	72: "w-72",
	80: "w-80",
	96: "w-96",
	auto: "w-auto",
	px: "w-px",
	"1/2": "w-1/2",
	"1/3": "w-1/3",
	"2/3": "w-2/3",
	"1/4": "w-1/4",
	"3/4": "w-3/4",
	full: "w-full",
	screen: "w-screen",
	min: "w-min",
	max: "w-max",
	fit: "w-fit",
} as const

const heightValues = {
	0: "h-0",
	1: "h-1",
	2: "h-2",
	3: "h-3",
	4: "h-4",
	5: "h-5",
	6: "h-6",
	8: "h-8",
	10: "h-10",
	12: "h-12",
	16: "h-16",
	20: "h-20",
	24: "h-24",
	32: "h-32",
	40: "h-40",
	48: "h-48",
	56: "h-56",
	64: "h-64",
	72: "h-72",
	80: "h-80",
	96: "h-96",
	auto: "h-auto",
	px: "h-px",
	"1/2": "h-1/2",
	"1/3": "h-1/3",
	"2/3": "h-2/3",
	"1/4": "h-1/4",
	"3/4": "h-3/4",
	full: "h-full",
	screen: "h-screen",
	min: "h-min",
	max: "h-max",
	fit: "h-fit",
} as const

const maxWidthValues = {
	0: "max-w-0",
	xs: "max-w-xs",
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
	"4xl": "max-w-4xl",
	"5xl": "max-w-5xl",
	"6xl": "max-w-6xl",
	"7xl": "max-w-7xl",
	full: "max-w-full",
	min: "max-w-min",
	max: "max-w-max",
	fit: "max-w-fit",
	prose: "max-w-prose",
	screenSm: "max-w-screen-sm",
	screenMd: "max-w-screen-md",
	screenLg: "max-w-screen-lg",
	screenXl: "max-w-screen-xl",
	screen2xl: "max-w-screen-2xl",
	none: "max-w-none",
} as const

const positionValues = {
	static: "static",
	fixed: "fixed",
	absolute: "absolute",
	relative: "relative",
	sticky: "sticky",
} as const

const zIndexValues = {
	0: "z-0",
	10: "z-10",
	20: "z-20",
	30: "z-30",
	40: "z-40",
	50: "z-50",
	auto: "z-auto",
} as const

const insetValues = {
	0: "inset-0",
	auto: "inset-auto",
} as const

const insetXValues = {
	0: "inset-x-0",
	auto: "inset-x-auto",
} as const

const insetYValues = {
	0: "inset-y-0",
	auto: "inset-y-auto",
} as const

const topValues = {
	0: "top-0",
	auto: "top-auto",
} as const

const rightValues = {
	0: "right-0",
	auto: "right-auto",
} as const

const bottomValues = {
	0: "bottom-0",
	auto: "bottom-auto",
} as const

const leftValues = {
	0: "left-0",
	auto: "left-auto",
} as const

const spacingValues = {
	0: "0",
	px: "px",
	0.5: "0.5",
	1: "1",
	1.5: "1.5",
	2: "2",
	2.5: "2.5",
	3: "3",
	3.5: "3.5",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "11",
	12: "12",
	14: "14",
	16: "16",
	20: "20",
	24: "24",
	28: "28",
	32: "32",
	36: "36",
	40: "40",
	44: "44",
	48: "48",
	52: "52",
	56: "56",
	60: "60",
	64: "64",
	72: "72",
	80: "80",
	96: "96",
	auto: "auto",
} as const

export type SpacingValue = keyof typeof spacingValues

const createSpacingMap = (prefix: string): Record<string, string> =>
	Object.fromEntries(Object.entries(spacingValues).map(([k, v]) => [k, `${prefix}-${v}`]))

const pValues = createSpacingMap("p")
const pxValues = createSpacingMap("px")
const pyValues = createSpacingMap("py")
const ptValues = createSpacingMap("pt")
const prValues = createSpacingMap("pr")
const pbValues = createSpacingMap("pb")
const plValues = createSpacingMap("pl")

const mValues = createSpacingMap("m")
const mxValues = createSpacingMap("mx")
const myValues = createSpacingMap("my")
const mtValues = createSpacingMap("mt")
const mrValues = createSpacingMap("mr")
const mbValues = createSpacingMap("mb")
const mlValues = createSpacingMap("ml")

const spaceXValues = createSpacingMap("space-x")
const spaceYValues = createSpacingMap("space-y")

const borderWidthValues = {
	0: "border-0",
	1: "border",
	2: "border-2",
	4: "border-4",
	8: "border-8",
} as const

const borderTValues = {
	0: "border-t-0",
	1: "border-t",
	2: "border-t-2",
	4: "border-t-4",
	8: "border-t-8",
} as const

const borderRValues = {
	0: "border-r-0",
	1: "border-r",
	2: "border-r-2",
	4: "border-r-4",
	8: "border-r-8",
} as const

const borderBValues = {
	0: "border-b-0",
	1: "border-b",
	2: "border-b-2",
	4: "border-b-4",
	8: "border-b-8",
} as const

const borderLValues = {
	0: "border-l-0",
	1: "border-l",
	2: "border-l-2",
	4: "border-l-4",
	8: "border-l-8",
} as const

const borderStyleValues = {
	solid: "border-solid",
	dashed: "border-dashed",
	dotted: "border-dotted",
	double: "border-double",
	hidden: "border-hidden",
	none: "border-none",
} as const

const borderRadiusValues = {
	none: "rounded-none",
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	xl: "rounded-xl",
	"2xl": "rounded-2xl",
	"3xl": "rounded-3xl",
	full: "rounded-full",
} as const

const bgColorValues = {
	transparent: "bg-transparent",
	current: "bg-current",
	inherit: "bg-inherit",
	white: "bg-white",
	black: "bg-black",
	background: "bg-background",
	foreground: "bg-foreground",
	primary: "bg-primary",
	"primary-foreground": "bg-primary-foreground",
	secondary: "bg-secondary",
	"secondary-foreground": "bg-secondary-foreground",
	muted: "bg-muted",
	"muted-foreground": "bg-muted-foreground",
	accent: "bg-accent",
	"accent-foreground": "bg-accent-foreground",
	destructive: "bg-destructive",
	"destructive-foreground": "bg-destructive-foreground",
	card: "bg-card",
	"card-foreground": "bg-card-foreground",
	popover: "bg-popover",
	"popover-foreground": "bg-popover-foreground",
	border: "bg-border",
	input: "bg-input",
	ring: "bg-ring",
} as const

const textColorValues = {
	transparent: "text-transparent",
	current: "text-current",
	inherit: "text-inherit",
	white: "text-white",
	black: "text-black",
	background: "text-background",
	foreground: "text-foreground",
	primary: "text-primary",
	"primary-foreground": "text-primary-foreground",
	secondary: "text-secondary",
	"secondary-foreground": "text-secondary-foreground",
	muted: "text-muted",
	"muted-foreground": "text-muted-foreground",
	accent: "text-accent",
	"accent-foreground": "text-accent-foreground",
	destructive: "text-destructive",
	"destructive-foreground": "text-destructive-foreground",
	card: "text-card",
	"card-foreground": "text-card-foreground",
	popover: "text-popover",
	"popover-foreground": "text-popover-foreground",
	border: "text-border",
	input: "text-input",
	ring: "text-ring",
} as const

const borderColorValues = {
	transparent: "border-transparent",
	current: "border-current",
	inherit: "border-inherit",
	white: "border-white",
	black: "border-black",
	background: "border-background",
	foreground: "border-foreground",
	primary: "border-primary",
	"primary-foreground": "border-primary-foreground",
	secondary: "border-secondary",
	"secondary-foreground": "border-secondary-foreground",
	muted: "border-muted",
	"muted-foreground": "border-muted-foreground",
	accent: "border-accent",
	"accent-foreground": "border-accent-foreground",
	destructive: "border-destructive",
	"destructive-foreground": "border-destructive-foreground",
	card: "border-card",
	"card-foreground": "border-card-foreground",
	popover: "border-popover",
	"popover-foreground": "border-popover-foreground",
	border: "border-border",
	input: "border-input",
	ring: "border-ring",
} as const

type Display = keyof typeof displayValues
type TextAlign = keyof typeof textAlignValues
type TextSize = keyof typeof textSizeValues
type FontWeight = keyof typeof fontWeightValues
type TextWrap = keyof typeof textWrapValues
type Grow = keyof typeof growValues
type Shrink = keyof typeof shrinkValues
type Width = keyof typeof widthValues
type Height = keyof typeof heightValues
type MaxWidth = keyof typeof maxWidthValues
type Position = keyof typeof positionValues
type ZIndex = keyof typeof zIndexValues
type Inset = keyof typeof insetValues
type InsetX = keyof typeof insetXValues
type InsetY = keyof typeof insetYValues
type Top = keyof typeof topValues
type Right = keyof typeof rightValues
type Bottom = keyof typeof bottomValues
type Left = keyof typeof leftValues
type BorderWidth = keyof typeof borderWidthValues
type BorderT = keyof typeof borderTValues
type BorderR = keyof typeof borderRValues
type BorderB = keyof typeof borderBValues
type BorderL = keyof typeof borderLValues
type BorderStyle = keyof typeof borderStyleValues
type BorderRadius = keyof typeof borderRadiusValues
type BgColor = keyof typeof bgColorValues
type TextColor = keyof typeof textColorValues
type BorderColor = keyof typeof borderColorValues

export function resolveResponsive<T extends string | number | boolean>(
	value: ResponsiveValue<T> | undefined,
	valueMap: Record<string, string>,
): string[] {
	if (value === undefined) {
		return []
	}

	if (typeof value === "object" && value !== null) {
		const classes: string[] = []
		for (const bp of breakpoints) {
			const val = (value as Partial<Record<Breakpoint, T>>)[bp]
			if (val !== undefined) {
				const className = valueMap[String(val)]
				if (className) {
					classes.push(bp === "default" ? className : `${bp}:${className}`)
				}
			}
		}
		return classes
	}

	const className = valueMap[String(value)]
	return className ? [className] : []
}

type BoxElement =
	| "div"
	| "main"
	| "section"
	| "article"
	| "aside"
	| "header"
	| "footer"
	| "nav"
	| "ul"
	| "ol"
	| "li"
	| "figure"
	| "figcaption"
	| "address"
	| "button"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"

interface BoxBaseProps {
	as?: BoxElement
	container?: boolean
	group?: boolean
	display?: ResponsiveValue<Display>
	textAlign?: ResponsiveValue<TextAlign>
	textSize?: ResponsiveValue<TextSize>
	fontWeight?: ResponsiveValue<FontWeight>
	textWrap?: ResponsiveValue<TextWrap>
	grow?: ResponsiveValue<Grow>
	shrink?: ResponsiveValue<Shrink>
	w?: ResponsiveValue<Width>
	h?: ResponsiveValue<Height>
	maxW?: ResponsiveValue<MaxWidth>
	position?: ResponsiveValue<Position>
	zIndex?: ResponsiveValue<ZIndex>
	inset?: ResponsiveValue<Inset>
	insetX?: ResponsiveValue<InsetX>
	insetY?: ResponsiveValue<InsetY>
	top?: ResponsiveValue<Top>
	right?: ResponsiveValue<Right>
	bottom?: ResponsiveValue<Bottom>
	left?: ResponsiveValue<Left>
	p?: ResponsiveValue<SpacingValue>
	px?: ResponsiveValue<SpacingValue>
	py?: ResponsiveValue<SpacingValue>
	pt?: ResponsiveValue<SpacingValue>
	pr?: ResponsiveValue<SpacingValue>
	pb?: ResponsiveValue<SpacingValue>
	pl?: ResponsiveValue<SpacingValue>
	m?: ResponsiveValue<SpacingValue>
	mx?: ResponsiveValue<SpacingValue>
	my?: ResponsiveValue<SpacingValue>
	mt?: ResponsiveValue<SpacingValue>
	mr?: ResponsiveValue<SpacingValue>
	mb?: ResponsiveValue<SpacingValue>
	ml?: ResponsiveValue<SpacingValue>
	spaceX?: ResponsiveValue<SpacingValue>
	spaceY?: ResponsiveValue<SpacingValue>
	border?: ResponsiveValue<BorderWidth>
	borderT?: ResponsiveValue<BorderT>
	borderR?: ResponsiveValue<BorderR>
	borderB?: ResponsiveValue<BorderB>
	borderL?: ResponsiveValue<BorderL>
	borderStyle?: ResponsiveValue<BorderStyle>
	rounded?: ResponsiveValue<BorderRadius>
	bg?: ResponsiveValue<BgColor>
	textColor?: ResponsiveValue<TextColor>
	borderColor?: ResponsiveValue<BorderColor>
}

export type BoxProps = BoxBaseProps & Omit<ComponentProps<"div">, keyof BoxBaseProps>

export function useBoxClasses({
	container,
	group,
	display,
	textAlign,
	textSize,
	fontWeight,
	textWrap,
	grow,
	shrink,
	w,
	h,
	maxW,
	position,
	zIndex,
	inset,
	insetX,
	insetY,
	top,
	right,
	bottom,
	left,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	spaceX,
	spaceY,
	border,
	borderT,
	borderR,
	borderB,
	borderL,
	borderStyle,
	rounded,
	bg,
	textColor,
	borderColor,
}: Omit<BoxProps, keyof ComponentProps<"div">>): string[] {
	return [
		container ? "container" : "",
		group ? "group" : "",
		...resolveResponsive(display, displayValues),
		...resolveResponsive(textAlign, textAlignValues),
		...resolveResponsive(textSize, textSizeValues),
		...resolveResponsive(fontWeight, fontWeightValues),
		...resolveResponsive(textWrap, textWrapValues),
		...resolveResponsive(grow, growValues),
		...resolveResponsive(shrink, shrinkValues),
		...resolveResponsive(w, widthValues),
		...resolveResponsive(h, heightValues),
		...resolveResponsive(maxW, maxWidthValues),
		...resolveResponsive(position, positionValues),
		...resolveResponsive(zIndex, zIndexValues),
		...resolveResponsive(inset, insetValues),
		...resolveResponsive(insetX, insetXValues),
		...resolveResponsive(insetY, insetYValues),
		...resolveResponsive(top, topValues),
		...resolveResponsive(right, rightValues),
		...resolveResponsive(bottom, bottomValues),
		...resolveResponsive(left, leftValues),
		...resolveResponsive(p, pValues),
		...resolveResponsive(px, pxValues),
		...resolveResponsive(py, pyValues),
		...resolveResponsive(pt, ptValues),
		...resolveResponsive(pr, prValues),
		...resolveResponsive(pb, pbValues),
		...resolveResponsive(pl, plValues),
		...resolveResponsive(m, mValues),
		...resolveResponsive(mx, mxValues),
		...resolveResponsive(my, myValues),
		...resolveResponsive(mt, mtValues),
		...resolveResponsive(mr, mrValues),
		...resolveResponsive(mb, mbValues),
		...resolveResponsive(ml, mlValues),
		...resolveResponsive(spaceX, spaceXValues),
		...resolveResponsive(spaceY, spaceYValues),
		...resolveResponsive(border, borderWidthValues),
		...resolveResponsive(borderT, borderTValues),
		...resolveResponsive(borderR, borderRValues),
		...resolveResponsive(borderB, borderBValues),
		...resolveResponsive(borderL, borderLValues),
		...resolveResponsive(borderStyle, borderStyleValues),
		...resolveResponsive(rounded, borderRadiusValues),
		...resolveResponsive(bg, bgColorValues),
		...resolveResponsive(textColor, textColorValues),
		...resolveResponsive(borderColor, borderColorValues),
	]
}

export function Box({
	as: Component = "div",
	className,
	container,
	group,
	display,
	textAlign,
	textSize,
	fontWeight,
	textWrap,
	grow,
	shrink,
	w,
	h,
	maxW,
	position,
	zIndex,
	inset,
	insetX,
	insetY,
	top,
	right,
	bottom,
	left,
	p,
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	spaceX,
	spaceY,
	border,
	borderT,
	borderR,
	borderB,
	borderL,
	borderStyle,
	rounded,
	bg,
	textColor,
	borderColor,
	...props
}: BoxProps) {
	const classes = cn(
		...useBoxClasses({
			container,
			group,
			display,
			textAlign,
			textSize,
			fontWeight,
			textWrap,
			grow,
			shrink,
			w,
			h,
			maxW,
			position,
			zIndex,
			inset,
			insetX,
			insetY,
			top,
			right,
			bottom,
			left,
			p,
			px,
			py,
			pt,
			pr,
			pb,
			pl,
			m,
			mx,
			my,
			mt,
			mr,
			mb,
			ml,
			spaceX,
			spaceY,
			border,
			borderT,
			borderR,
			borderB,
			borderL,
			borderStyle,
			rounded,
			bg,
			textColor,
			borderColor,
		}),
		className,
	)

	const Comp = Component as "div"

	return <Comp className={classes} {...props} />
}
