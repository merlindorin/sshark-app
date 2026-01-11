import type { ComponentProps, ElementType } from "react"
import { cn } from "@/lib/utils"

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

type BoxProps<T extends BoxElement = "div"> = {
	as?: T
} & ComponentProps<T>

export function Box<T extends BoxElement = "div">({ as, className, ...props }: BoxProps<T>) {
	const Component = (as || "div") as ElementType
	return <Component className={cn(className)} {...props} />
}
