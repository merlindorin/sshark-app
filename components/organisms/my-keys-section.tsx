"use client"

import { AlertTriangle, Key, RefreshCw, ShieldCheck, ShieldQuestion, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionTitle,
} from "@/components/pages/page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ConnectedAccount, MyGPGKey, MySSHKey } from "@/hooks/use-my-keys"
import { useMyKeys, useRefreshMyKeys, useRevokeKey } from "@/hooks/use-my-keys"
import type { Task } from "@/hooks/use-tasks"
import { isSettled, useReloadTasks, useTasks } from "@/hooks/use-tasks"

/** A fingerprint is long and its tail is the distinctive part, so keep the tail readable. */
const FINGERPRINT_HEAD = 24

type AnyKey = MyGPGKey | MySSHKey

function formatKeyDate(value: string): string {
	return new Date(value).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
}

function shortFingerprint(fingerprint: string): string {
	if (fingerprint.length <= FINGERPRINT_HEAD) {
		return fingerprint
	}
	return `${fingerprint.slice(0, FINGERPRINT_HEAD)}…`
}

function errorMessage(error: unknown, fallback: string): string {
	if (error && typeof error === "object" && "error" in error) {
		const detail = (error as { error?: { message?: string; suggestion?: string } }).error
		if (detail?.message) {
			return detail.suggestion ? `${detail.message} ${detail.suggestion}` : detail.message
		}
	}
	if (error instanceof Error) {
		return error.message
	}
	return fallback
}

function VerifiedBadge({ verified }: { verified: boolean }) {
	if (verified) {
		return (
			<Badge variant="secondary">
				<ShieldCheck className="mr-1 h-3 w-3" />
				Verified
			</Badge>
		)
	}

	return (
		<Badge title="Connect this provider to prove you own this account" variant="outline">
			<ShieldQuestion className="mr-1 h-3 w-3" />
			Unverified
		</Badge>
	)
}

function RevokeKeyDialog({
	keyToRevoke,
	keyLabel,
	onClose,
	onQueued,
}: {
	keyToRevoke: AnyKey | null
	keyLabel: string
	onClose: () => void
	onQueued: () => void
}) {
	const { mutate: revoke, isPending } = useRevokeKey()

	const handleRevoke = () => {
		if (!keyToRevoke) {
			return
		}

		revoke(keyToRevoke.id, {
			onSuccess: () => {
				onClose()
				onQueued()
			},
			onError: (error) => {
				toast.error("Could not revoke key", {
					description: errorMessage(error, "Failed to revoke the key."),
				})
			},
		})
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					onClose()
				}
			}}
			open={keyToRevoke !== null}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Revoke this {keyLabel} key?</DialogTitle>
					<DialogDescription>
						The key is deleted from {keyToRevoke?.source?.provider ?? "the provider"} and removed from
						SSHark. Anything relying on it stops working. This cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="rounded-md border bg-muted/40 px-4 py-3">
					<code className="break-all text-xs">{keyToRevoke?.fingerprint}</code>
				</div>
				<DialogFooter>
					<Button disabled={isPending} onClick={onClose} variant="outline">
						Cancel
					</Button>
					<Button disabled={isPending} onClick={handleRevoke} variant="destructive">
						{isPending ? "Queueing..." : "Revoke key"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function AccountsSummary({ accounts }: { accounts: ConnectedAccount[] }) {
	if (accounts.length === 0) {
		return (
			<Card className="mb-6">
				<CardContent className="flex items-start gap-3 py-4">
					<ShieldQuestion className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
					<div>
						<p className="font-medium text-sm">No provider account connected</p>
						<p className="text-muted-foreground text-sm">
							Sign in with GitHub to verify the keys published under your username and manage them from
							here.
						</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="mb-6 flex flex-wrap gap-2">
			{accounts.map((account) => (
				<Badge
					key={`${account.provider}:${account.username}`}
					variant={account.can_revoke ? "secondary" : "outline"}>
					{account.can_revoke ? (
						<ShieldCheck className="mr-1 h-3 w-3" />
					) : (
						<AlertTriangle className="mr-1 h-3 w-3" />
					)}
					{account.provider}/{account.username}
					{!account.can_revoke && account.missing_scopes && account.missing_scopes.length > 0 && (
						<span className="ml-1 text-muted-foreground">
							· reconnect to grant {account.missing_scopes.join(", ")}
						</span>
					)}
				</Badge>
			))}
		</div>
	)
}

function KeyRow({ entry, detail, onRevoke }: { entry: AnyKey; detail: string; onRevoke: (entry: AnyKey) => void }) {
	return (
		<TableRow>
			<TableCell>
				<code className="text-xs" title={entry.fingerprint}>
					{shortFingerprint(entry.fingerprint)}
				</code>
				{detail && <div className="text-muted-foreground text-xs">{detail}</div>}
			</TableCell>
			<TableCell className="text-muted-foreground text-xs">{entry.algorithm ?? "—"}</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<VerifiedBadge verified={entry.verified} />
					{entry.source?.provider && <Badge variant="outline">{entry.source.provider}</Badge>}
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground text-xs">{formatKeyDate(entry.created_at)}</TableCell>
			<TableCell>
				<Button
					aria-label="Revoke key"
					disabled={!entry.revocable}
					onClick={() => onRevoke(entry)}
					size="sm"
					title={entry.revocable ? "Revoke this key" : "Connect the provider to manage this key"}
					variant="ghost">
					<Trash2 className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	)
}

function KeyTable({
	entries,
	detailOf,
	onRevoke,
}: {
	entries: AnyKey[]
	detailOf: (entry: AnyKey) => string
	onRevoke: (entry: AnyKey) => void
}) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Fingerprint</TableHead>
						<TableHead>Algorithm</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Added</TableHead>
						<TableHead className="w-[50px]" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{entries.map((entry) => (
						<KeyRow detail={detailOf(entry)} entry={entry} key={entry.id} onRevoke={onRevoke} />
					))}
				</TableBody>
			</Table>
		</div>
	)
}

function EmptyKeys({ label }: { label: string }) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-10">
				<Key className="mb-3 h-10 w-10 text-muted-foreground" />
				<p className="text-center text-muted-foreground text-sm">
					No {label} keys found for your accounts. Add one at your provider, then refresh.
				</p>
			</CardContent>
		</Card>
	)
}

function sshDetail(entry: AnyKey): string {
	return (entry as MySSHKey).comment ?? ""
}

function gpgDetail(entry: AnyKey): string {
	return (entry as MyGPGKey).user_ids?.join(", ") ?? ""
}

export function MyKeysSection() {
	const { data, isLoading } = useMyKeys()
	const { mutate: refresh, isPending: isQueueing } = useRefreshMyKeys()
	const { data: tasks } = useTasks()
	const reloadTasks = useReloadTasks()
	const [keyToRevoke, setKeyToRevoke] = useState<AnyKey | null>(null)
	const [revokeLabel, setRevokeLabel] = useState("SSH")

	// Progress is shown in the Activity panel, not here. This only needs to know whether work is
	// already in flight, so the button does not invite a second click the API would ignore.
	const hasRunningKeyTask = (tasks ?? []).some((task: Task) => !isSettled(task))
	const isWorking = isQueueing || hasRunningKeyTask

	const handleRefresh = () => {
		refresh(undefined, {
			onSuccess: () => {
				reloadTasks()
			},
			onError: (error) => {
				toast.error("Could not refresh keys", {
					description: errorMessage(error, "Failed to refresh your keys."),
				})
			},
		})
	}

	const openRevoke = (label: string) => {
		return (entry: AnyKey) => {
			setRevokeLabel(label)
			setKeyToRevoke(entry)
		}
	}

	if (isLoading) {
		return (
			<PageSection>
				<Skeleton className="h-64 w-full rounded-xl" />
			</PageSection>
		)
	}

	const accounts = data?.accounts ?? []
	const sshKeys = data?.ssh_keys ?? []
	const gpgKeys = data?.gpg_keys ?? []

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>Your Keys</PageSectionTitle>
				<PageSectionParagraph>
					The SSH and GPG keys SSHark knows about for your connected accounts. Revoking a key deletes it at
					the provider too.
				</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				<AccountsSummary accounts={accounts} />

				<div className="mb-6 flex items-center justify-end">
					<Button disabled={isWorking} onClick={handleRefresh} size="sm" variant="outline">
						<RefreshCw className={`mr-2 h-4 w-4 ${isWorking ? "animate-spin" : ""}`} />
						{isWorking ? "Working..." : "Refresh"}
					</Button>
				</div>

				<h3 className="mb-3 font-semibold text-lg">SSH Keys</h3>
				{sshKeys.length === 0 ? (
					<EmptyKeys label="SSH" />
				) : (
					<KeyTable detailOf={sshDetail} entries={sshKeys} onRevoke={openRevoke("SSH")} />
				)}

				<h3 className="mt-8 mb-3 font-semibold text-lg">GPG Keys</h3>
				{gpgKeys.length === 0 ? (
					<EmptyKeys label="GPG" />
				) : (
					<KeyTable detailOf={gpgDetail} entries={gpgKeys} onRevoke={openRevoke("GPG")} />
				)}

				<RevokeKeyDialog
					keyLabel={revokeLabel}
					keyToRevoke={keyToRevoke}
					onClose={() => setKeyToRevoke(null)}
					onQueued={reloadTasks}
				/>
			</PageSectionContent>
		</PageSection>
	)
}
