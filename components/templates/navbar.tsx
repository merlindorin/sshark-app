"use client"

import { ModeToggle } from "@/components/molecules/ModeToggle"
import { Links } from "@/components/templates/links"
import { Logo } from "@/components/templates/logo"
import { MobileMenu } from "@/components/templates/mobile-menu"
import { Button } from "@/components/ui/button"
import { links } from "app/links"

export function Navbar() {
    return (
        <div
            className="fixed inset-x-0 top-(--fd-banner-height) z-40 flex items-center justify-between bg-fd-background/80 px-4 py-4 backdrop-blur-sm transition-colors">
            <div className="flex grow items-center gap-3">
                <Links links={links} className="hidden gap-1 md:flex"/>
                <Links links={[{
                    href: "/",
                    label: "Welcome",
                    children: <Logo/>,
                }]} className="flex gap-1 md:hidden"/>
            </div>
            <div className="items-center gap-3 hidden md:flex">
                <Button>
                    Signup
                </Button>
                <ModeToggle/>
            </div>
            <div className="flex items-center gap-3 md:hidden">
                <MobileMenu links={links}/>
            </div>
        </div>
    )
}
