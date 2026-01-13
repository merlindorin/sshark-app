import {cn} from "@/lib/utils";
import type {ComponentProps, PropsWithChildren} from "react"

export function SubTitle({className, children}: PropsWithChildren & ComponentProps<"p">) {
    return <p className={cn("text-balance text-lg text-muted-foreground xl:text-2xl xl:pt-4", className)}>{children}</p>
}

export function MainTitle({className, children}: PropsWithChildren & ComponentProps<"h1">) {
    return <h1
        className={cn("text-balance font-bold text-5xl text-foreground tracking-tight sm:text-6xl xl:text-8xl", className)}>{children}</h1>
}

export default function Headline({children, className, ...props}: PropsWithChildren & ComponentProps<"div">) {
    return (
        <div className={cn("gap-8 text-center", className)} {...props}>{children}</div>
    )
}
