"use client"

import { NavLink } from "app/links"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type LinksProps = {
    className: string
    links: NavLink[]
};

export const Links = ({className, links}: LinksProps) => {
    const pathname = usePathname()
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {links.map(({children, label, href, ...props}) => (
                <Link
                    className={cn(
                        navigationMenuTriggerStyle(),
                        "h-auto bg-transparent px-3 py-1.5 shadow-none transition-all",
                        (pathname === href) && "bg-primary/10 text-primary",
                    )}
                    href={href}
                    key={label}
                    {...props}
                >
                    {children || label}
                </Link>
            ))}
        </div>
    )
}