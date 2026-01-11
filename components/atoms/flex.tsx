import type { ComponentProps, ElementType } from "react"
import { cn } from "@/lib/utils"

type FlexElement = "div" | "main" | "section" | "article" | "aside" | "header" | "footer" | "nav" | "ul" | "ol" | "li"

type FlexProps<T extends FlexElement = "div"> = {
	as?: T
} & ComponentProps<T>

export function Flex<T extends FlexElement = "div">({ as, className, ...props }: FlexProps<T>) {
	const Component = (as || "div") as ElementType
	return <Component className={cn("flex", className)} {...props} />
}
