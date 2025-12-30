"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";
import ModeToggle from "@/components/molecules/ModeToggle";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function Header() {
    const pathname = usePathname();

    const navLinks = [
        {href: "/docs", label: "Docs"},
        {href: "/roadmap", label: "Roadmap"},
        {href: "/about", label: "About"},
    ];

    return (
        <header className="border-b border-border">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    sshark.app
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">
                    {navLinks.map(({href, label}) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm font-semibold border-b border-dotted transition-colors ${
                                pathname === href
                                    ? "text-foreground border-foreground"
                                    : "text-muted-foreground border-muted-foreground hover:text-foreground hover:border-foreground"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-not-allowed">
                                <Button variant="outline" size="sm" className="opacity-50 pointer-events-none">
                                    Sign up
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Coming soon! <Link href="/roadmap" className="underline">See roadmap</Link></p>
                        </TooltipContent>
                    </Tooltip>

                    <ModeToggle/>
                </div>
            </div>
        </header>
    )
}