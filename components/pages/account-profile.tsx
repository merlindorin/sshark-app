import { Calendar, Download, Key, Shield, ShieldCheck } from "lucide-react"
import type { ComponentType } from "react"
import { ProviderIcon } from "@/components/molecules/provider-icon"
import type { GPGKey } from "@/components/organisms/gpg-key-card"
import { ProfileKeyList } from "@/components/organisms/profile-key-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SSHKey } from "@/hooks/use-ssh-keys"
import { providerLabel } from "@/lib/providers"
import type { ProfileAccount, ProfileKey, PublicProfile } from "@/lib/public-profile"

/** Splits a name on the separators people actually use, to build initials. */
const NAME_SEPARATOR = /[\s_-]+/

function formatJoined(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function initialsFor(profile: PublicProfile): string {
	const source = profile.display_name || profile.username
	const initials = source
		.split(NAME_SEPARATOR)
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")

	return initials.toUpperCase() || "U"
}

function StatTile({
	label,
	value,
	icon: Icon,
}: {
	label: string
	value: number
	icon: ComponentType<{ className?: string }>
}) {
	return (
		<div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3">
			<Icon className="h-4 w-4 shrink-0 text-accent" />
			<div className="leading-tight">
				<p className="font-semibold text-xl tabular-nums">{value}</p>
				<p className="text-muted-foreground text-xs">{label}</p>
			</div>
		</div>
	)
}

function AccountBadge({ account }: { account: ProfileAccount }) {
	const label = `${providerLabel(account.provider)} @${account.username}`

	if (!account.uri) {
		return (
			<Badge variant="outline">
				<ProviderIcon className="mr-1 h-3 w-3" provider={account.provider} />
				{label}
			</Badge>
		)
	}

	return (
		<a href={account.uri} rel="noopener noreferrer" target="_blank">
			<Badge className="transition-colors hover:border-primary" variant="outline">
				<ProviderIcon className="mr-1 h-3 w-3" provider={account.provider} />
				{label}
			</Badge>
		</a>
	)
}

function KeySection({
	title,
	entries,
	downloadHref,
	downloadName,
	emptyLabel,
	kind,
}: {
	title: string
	entries: ProfileKey[]
	downloadHref: string
	downloadName: string
	emptyLabel: string
	kind: "ssh" | "gpg"
}) {
	return (
		<section className="mt-8">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-2xl">{title}</h2>
				{entries.length > 0 && (
					<Button asChild size="sm" variant="outline">
						<a download={downloadName} href={downloadHref}>
							<Download className="mr-2 h-4 w-4" />
							Download
						</a>
					</Button>
				)}
			</div>

			{entries.length === 0 ? (
				<div className="rounded-lg border border-border border-dashed p-10 text-center">
					<Key className="mx-auto h-8 w-8 text-muted-foreground" />
					<p className="mt-3 text-muted-foreground text-sm">{emptyLabel}</p>
				</div>
			) : (
				<ProfileKeyList
					gpgKeys={kind === "gpg" ? (entries as GPGKey[]) : undefined}
					sshKeys={kind === "ssh" ? (entries as unknown as SSHKey[]) : undefined}
				/>
			)}
		</section>
	)
}

/**
 * The public page of an SSHark account. Everything here is tied to a provider account the
 * owner proved they hold, so the keys shown are genuinely theirs rather than merely published
 * under a matching name.
 */
export function AccountProfileView({ profile }: { profile: PublicProfile }) {
	const handle = `@${profile.username}`

	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="mx-auto max-w-4xl px-4 pt-6 md:px-6">
				<div className="rounded-2xl border border-border bg-linear-to-br from-muted/40 to-muted/10 p-6 md:p-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex min-w-0 flex-1 items-center gap-5">
							<Avatar className="h-20 w-20 shrink-0 border-2 border-background shadow-md md:h-24 md:w-24">
								<AvatarImage alt={profile.display_name ?? handle} src={profile.avatar_url} />
								<AvatarFallback className="text-2xl">{initialsFor(profile)}</AvatarFallback>
							</Avatar>

							<div className="min-w-0 space-y-2">
								<h1 className="truncate font-bold text-2xl tracking-tight md:text-3xl">
									{profile.display_name || handle}
								</h1>
								{profile.display_name && (
									<p className="font-medium text-muted-foreground text-sm">{handle}</p>
								)}

								<div className="flex flex-wrap items-center gap-2">
									<Badge variant="secondary">
										<Shield className="mr-1 h-3 w-3" />
										SSHark account
									</Badge>
									<Badge variant="outline">
										<Calendar className="mr-1 h-3 w-3" />
										Joined {formatJoined(profile.created_at)}
									</Badge>
									{profile.accounts.map((account) => (
										<AccountBadge
											account={account}
											key={`${account.provider}:${account.username}`}
										/>
									))}
								</div>
							</div>
						</div>

						<div className="grid shrink-0 grid-cols-3 gap-3">
							<StatTile icon={Key} label="SSH keys" value={profile.ssh_keys.length} />
							<StatTile icon={ShieldCheck} label="GPG keys" value={profile.gpg_keys.length} />
							<StatTile icon={Shield} label="Providers" value={profile.accounts.length} />
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
				<KeySection
					downloadHref={`/${handle}.keys`}
					downloadName={`${profile.username}.keys`}
					emptyLabel="This account has no public SSH keys."
					entries={profile.ssh_keys}
					kind="ssh"
					title="SSH Keys"
				/>
				<KeySection
					downloadHref={`/${handle}.gpg`}
					downloadName={`${profile.username}.gpg`}
					emptyLabel="This account has no public GPG keys."
					entries={profile.gpg_keys}
					kind="gpg"
					title="GPG Keys"
				/>

				<div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
					<h3 className="mb-2 font-semibold text-sm">Available formats</h3>
					<div className="space-y-2 text-sm">
						<div className="flex flex-wrap items-center gap-2">
							<code className="rounded bg-muted px-2 py-1 font-mono text-xs">
								curl sshark.app/{handle}.keys
							</code>
							<span className="text-muted-foreground text-xs">authorized_keys format</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<code className="rounded bg-muted px-2 py-1 font-mono text-xs">
								curl sshark.app/{handle}.gpg
							</code>
							<span className="text-muted-foreground text-xs">armored GPG public keys</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
