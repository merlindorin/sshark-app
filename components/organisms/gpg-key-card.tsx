"use client"

import { CopyIcon, ExternalLink, MoreHorizontalIcon, ShieldCheckIcon } from "lucide-react"
import { toast } from "sonner"
import { Pill, PillIcon } from "@/components/kibo-ui/pill"
import { ProviderPill, UserPill } from "@/components/molecules/home-pill"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Source } from "@/hooks/use-ssh-keys"

interface GPGKey {
	id: string
	fingerprint: string
	key_data: string
	algorithm?: string
	key_bits?: number
	expires_at?: string
	user_ids?: string[]
	capabilities?: string[]
	created_at: string
	updated_at: string
	source?: Source
}

export type { GPGKey }

interface GPGKeyCardProps {
	gpgKey: GPGKey
}

function decodeArmored(b64: string): string {
	try {
		if (typeof atob === "function") {
			return atob(b64)
		}
		return Buffer.from(b64, "base64").toString("utf-8")
	} catch {
		return b64
	}
}

export function GPGKeyCard({ gpgKey }: GPGKeyCardProps) {
	const armored = decodeArmored(gpgKey.key_data)
	const algoLabel = [gpgKey.algorithm, gpgKey.key_bits ? `${gpgKey.key_bits}` : null].filter(Boolean).join("/")

	return (
		<div className="space-y-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50">
			<div className="flex items-center justify-between gap-4">
				<div className="flex grow flex-wrap items-center gap-1">
					{gpgKey.source?.provider && <ProviderPill provider={gpgKey.source.provider} />}
					{gpgKey.source?.username && <UserPill user={gpgKey.source.username} />}
					{algoLabel && (
						<Pill>
							<PillIcon icon={ShieldCheckIcon} />
							{algoLabel}
						</Pill>
					)}
					{gpgKey.capabilities?.map((cap) => (
						<Pill key={cap}>{cap}</Pill>
					))}
				</div>
				<GPGKeyActions armored={armored} sourceUri={gpgKey.source?.uri} />
			</div>
			<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
				<code className="rounded bg-muted px-1.5 py-0.5 font-mono">{gpgKey.fingerprint}</code>
				{gpgKey.expires_at && <span>expires {new Date(gpgKey.expires_at).toLocaleDateString()}</span>}
				{gpgKey.user_ids && gpgKey.user_ids.length > 0 && (
					<span className="truncate">{gpgKey.user_ids.join(", ")}</span>
				)}
			</div>
			<details className="group">
				<summary className="cursor-pointer text-muted-foreground text-xs hover:text-foreground">
					Show key
				</summary>
				<pre className="mt-2 overflow-x-auto rounded bg-muted px-3 py-2 font-mono text-foreground text-xs">
					{armored}
				</pre>
			</details>
		</div>
	)
}

function GPGKeyActions({ armored, sourceUri }: { armored: string; sourceUri?: string }) {
	const copy = () => {
		navigator.clipboard.writeText(armored)
		toast.success("Copied to clipboard")
	}
	return (
		<div className="flex">
			<ButtonGroup>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant="ghost">
							<MoreHorizontalIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={copy}>
							<CopyIcon className="mr-0 h-1 w-10" /> Copy
						</DropdownMenuItem>
						{sourceUri && (
							<DropdownMenuItem onClick={() => window.open(sourceUri, "_blank")?.focus()}>
								<ExternalLink className="mr-0 h-1 w-10" /> Source
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</ButtonGroup>
		</div>
	)
}
