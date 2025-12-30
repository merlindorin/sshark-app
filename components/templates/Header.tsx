import Link from "next/link";
import ModeToggle from "@/components/molecules/ModeToggle";
import {Button} from "@/components/ui/button";

export function Header() {
    return (
        <header className="border-b border-border">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    sshark.app
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <ModeToggle/>
                </div>
            </div>
        </header>
    )
}