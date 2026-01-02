import { Logo } from "@/components/templates/logo"
import { LinkProps } from "next/dist/client/link"
import { PropsWithChildren } from "react"

export type NavLink = LinkProps & PropsWithChildren & {
    label: string;
}

export const links: NavLink[] = [
    {
        href: "/",
        label: "Welcome",
        children: <Logo />,
    },
    {
        href: "/roadmap",
        label: "Roadmap",
    },
    {
        href: "/about",
        label: "About",
    },
    {
        href: "/docs",
        label: "Docs",
    },
]
