import { BadgeCheck } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Opens the SSHark profile of the person who published this key.
 *
 * A claimed account defaults to the provider login it was created from, so the login is the
 * address to try. Nobody has claimed it, /@name 404s — the search response carries no signal
 * about who holds an account, so this cannot yet be hidden for unclaimed names.
 */
export function SourceProfileLink({ username, provider }: { username: string; provider: string }) {
	const label = `View @${username} on SSHark`

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						aria-label={label}
						className="inline-flex shrink-0 items-center rounded-full p-1 text-green-500 transition-colors hover:bg-green-500/10 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
						data-provider={provider}
						href={`/@${username}`}>
						<BadgeCheck className="size-5" />
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
