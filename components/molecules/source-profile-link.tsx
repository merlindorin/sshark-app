import { BadgeCheck } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Marks a key as belonging to someone who holds an SSHark account, and opens their profile.
 *
 * It is only rendered when the API reports an owner, so the check means something: the account
 * was connected and verified, not merely named the same. Most indexed keys have no owner and
 * show no badge.
 */
export function SourceProfileLink({ username }: { username: string }) {
	const label = `Verified — view @${username} on SSHark`

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						aria-label={label}
						className="inline-flex shrink-0 items-center rounded-full p-1 text-green-500 transition-colors hover:bg-green-500/10 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
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
