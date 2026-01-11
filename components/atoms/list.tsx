import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function Ul({ className, ...props }: ComponentProps<"ul">) {
	return <ul className={cn(className)} {...props} />
}

export function Ol({ className, ...props }: ComponentProps<"ol">) {
	return <ol className={cn(className)} {...props} />
}

export function Li({ className, ...props }: ComponentProps<"li">) {
	return <li className={cn(className)} {...props} />
}
