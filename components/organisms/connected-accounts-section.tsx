"use client"

import { AlertTriangle, Plus, ShieldCheck, Unlink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ProviderIcon } from "@/components/molecules/provider-icon"
import {
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionTitle,
} from "@/components/pages/page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import type { ConnectedAccount, SupportedProvider } from "@/hooks/use-connected-accounts"
import { useConnectedAccounts } from "@/hooks/use-connected-accounts"

function DisconnectDialog({
	account,
	onClose,
	onConfirm,
	isPending,
}: {
	account: ConnectedAccount | null
	onClose: () => void
	onConfirm: (account: ConnectedAccount) => void
	isPending: boolean
}) {
	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					onClose()
				}
			}}
			open={account !== null}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Disconnect {account?.label}?</DialogTitle>
					<DialogDescription>
						SSHark stops treating {account?.label} keys published under{" "}
						{account?.username ?? "this account"} as yours, and can no longer revoke them on your behalf.
						The keys themselves stay untouched at {account?.label}.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button disabled={isPending} onClick={onClose} variant="outline">
						Cancel
					</Button>
					<Button disabled={isPending} onClick={() => account && onConfirm(account)} variant="destructive">
						{isPending ? "Disconnecting..." : "Disconnect"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function AccountCard({
	account,
	onDisconnect,
	onReauthorize,
	isDisconnecting,
	isReauthorizing,
}: {
	account: ConnectedAccount
	onDisconnect: (account: ConnectedAccount) => void
	onReauthorize: (account: ConnectedAccount) => void
	isDisconnecting: boolean
	isReauthorizing: boolean
}) {
	return (
		<Card>
			<CardContent className="flex flex-wrap items-center gap-4 py-4">
				<Avatar className="h-10 w-10">
					<AvatarImage alt={account.username ?? account.label} src={account.imageUrl} />
					<AvatarFallback>
						<ProviderIcon className="h-5 w-5" provider={account.provider} />
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<ProviderIcon className="h-4 w-4" provider={account.provider} />
						<span className="font-medium">{account.label}</span>
						{account.username && <span className="text-muted-foreground text-sm">@{account.username}</span>}
						{account.verified ? (
							<Badge variant="secondary">Connected</Badge>
						) : (
							<Badge variant="destructive">Incomplete</Badge>
						)}
					</div>
					{account.verificationError ? (
						<p className="mt-1 text-destructive text-xs">{account.verificationError}</p>
					) : (
						<p className="mt-1 text-muted-foreground text-xs">{account.emailAddress}</p>
					)}
					{account.missingScopes.length > 0 && (
						<p className="mt-1 text-amber-600 text-xs dark:text-amber-500">
							SSHark cannot revoke {account.label} keys yet. Grant {account.missingScopes.join(", ")} to
							enable it.
						</p>
					)}
					{account.isLastSignInMethod && (
						<p className="mt-1 text-muted-foreground text-xs">
							This is your only way to sign in. Connect another provider before disconnecting it.
						</p>
					)}
				</div>

				<div className="flex items-center gap-1">
					{account.missingScopes.length > 0 && (
						<Button
							disabled={isReauthorizing}
							onClick={() => onReauthorize(account)}
							size="sm"
							title={`Grant SSHark permission to manage your ${account.label} keys`}
							variant="outline">
							<ShieldCheck className="mr-2 h-4 w-4" />
							{isReauthorizing ? "Redirecting..." : "Grant permissions"}
						</Button>
					)}
					<Button
						disabled={isDisconnecting || account.isLastSignInMethod}
						onClick={() => onDisconnect(account)}
						size="sm"
						title={
							account.isLastSignInMethod
								? "Connect another provider first"
								: `Disconnect ${account.label}`
						}
						variant="ghost">
						<Unlink className="mr-2 h-4 w-4" />
						{isDisconnecting ? "Disconnecting..." : "Disconnect"}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export function ConnectedAccountsSection() {
	const {
		isLoaded,
		accounts,
		availableProviders,
		connect,
		reauthorize,
		disconnect,
		pendingProvider,
		disconnectingId,
	} = useConnectedAccounts()
	const [accountToDisconnect, setAccountToDisconnect] = useState<ConnectedAccount | null>(null)

	const handleReauthorize = async (account: ConnectedAccount) => {
		try {
			await reauthorize(account)
		} catch (error) {
			toast.error(`Could not update ${account.label} permissions`, {
				description: error instanceof Error ? error.message : "Please try again.",
			})
		}
	}

	const handleConnect = async (candidate: SupportedProvider) => {
		try {
			await connect(candidate)
		} catch (error) {
			toast.error(`Could not connect ${candidate.label}`, {
				description: error instanceof Error ? error.message : "Please try again.",
			})
		}
	}

	const handleDisconnect = async (account: ConnectedAccount) => {
		try {
			await disconnect(account)
			setAccountToDisconnect(null)
			toast.success(`${account.label} disconnected`, {
				description: `SSHark no longer manages keys for ${account.label}.`,
			})
		} catch (error) {
			toast.error("Could not disconnect", {
				description: error instanceof Error ? error.message : "Please try again.",
			})
		}
	}

	if (!isLoaded) {
		return (
			<PageSection>
				<Skeleton className="h-48 w-full rounded-xl" />
			</PageSection>
		)
	}

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>Connected Accounts</PageSectionTitle>
				<PageSectionParagraph>
					Connect the providers you publish keys on. Each connection proves the account is yours, so SSHark
					can show its keys as verified and revoke them when you ask.
				</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				<div className="space-y-3">
					{accounts.map((account) => (
						<AccountCard
							account={account}
							isDisconnecting={disconnectingId === account.id}
							isReauthorizing={pendingProvider === account.provider}
							key={account.id}
							onDisconnect={setAccountToDisconnect}
							onReauthorize={handleReauthorize}
						/>
					))}
				</div>

				{availableProviders.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{availableProviders.map((candidate) => (
							<Button
								disabled={pendingProvider !== null}
								key={candidate.provider}
								onClick={() => handleConnect(candidate)}
								variant="outline">
								{pendingProvider === candidate.provider ? (
									<Plus className="mr-2 h-4 w-4 animate-pulse" />
								) : (
									<ProviderIcon className="mr-2 h-4 w-4" provider={candidate.provider} />
								)}
								{pendingProvider === candidate.provider
									? `Redirecting to ${candidate.label}...`
									: `Connect ${candidate.label}`}
							</Button>
						))}
					</div>
				)}

				{accounts.length === 0 && (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-10">
							<AlertTriangle className="mb-3 h-10 w-10 text-muted-foreground" />
							<p className="text-center text-muted-foreground text-sm">
								No provider connected yet. Connect one to see and manage your keys.
							</p>
						</CardContent>
					</Card>
				)}

				<DisconnectDialog
					account={accountToDisconnect}
					isPending={disconnectingId !== null}
					onClose={() => setAccountToDisconnect(null)}
					onConfirm={handleDisconnect}
				/>
			</PageSectionContent>
		</PageSection>
	)
}
