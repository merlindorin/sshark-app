import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-border border-t">
			<div className="group container mx-auto flex items-center justify-center gap-1 px-6 py-4 text-muted-foreground text-sm">
				<span>Created with</span>
				<span className="grayscale transition-all group-hover:scale-125 group-hover:animate-pulse group-hover:grayscale-0">
					❤️
				</span>
				<span>by</span>
				<Link
					className="font-medium text-foreground transition-colors hover:text-accent"
					href="https://github.com/merlindorin"
					rel="noopener noreferrer"
					target="_blank">
					@merlindorin
				</Link>
			</div>
		</footer>
	)
}
