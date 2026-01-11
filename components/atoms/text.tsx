import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function P({ className, ...props }: ComponentProps<"p">) {
	return <p className={cn(className)} {...props} />
}

export function Span({ className, ...props }: ComponentProps<"span">) {
	return <span className={cn(className)} {...props} />
}

export function H1({ className, ...props }: ComponentProps<"h1">) {
	return <h1 className={cn(className)} {...props} />
}

export function H2({ className, ...props }: ComponentProps<"h2">) {
	return <h2 className={cn(className)} {...props} />
}

export function H3({ className, ...props }: ComponentProps<"h3">) {
	return <h3 className={cn(className)} {...props} />
}

export function H4({ className, ...props }: ComponentProps<"h4">) {
	return <h4 className={cn(className)} {...props} />
}

export function H5({ className, ...props }: ComponentProps<"h5">) {
	return <h5 className={cn(className)} {...props} />
}

export function H6({ className, ...props }: ComponentProps<"h6">) {
	return <h6 className={cn(className)} {...props} />
}
