import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="group container mx-auto px-6 py-4 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>Created with</span>
                <span className="grayscale group-hover:grayscale-0 group-hover:animate-pulse group-hover:scale-125 transition-all">❤️</span>
                <span>by</span>
                <Link
                    href="https://github.com/merlindorin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-accent transition-colors"
                >
                    @merlindorin
                </Link>
            </div>
        </footer>
    )
}