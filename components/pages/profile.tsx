"use client"

import { RedirectToSignIn, useUser } from "@clerk/nextjs"
import { Calendar, Copy, ExternalLink, Key, Mail, Plus, Shield, ShieldCheck, Trash2 } from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { ProviderIcon } from "@/components/molecules/provider-icon"
import { ConnectedAccountsSection } from "@/components/organisms/connected-accounts-section"
import { DeleteAccountSection } from "@/components/organisms/delete-account-section"
import { MyKeysSection } from "@/components/organisms/my-keys-section"
import { TasksSection } from "@/components/organisms/tasks-section"
import { UsernameSection } from "@/components/organisms/username-section"
import {
	Page,
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
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@/hooks/use-api-keys"
import { useConnectedAccounts } from "@/hooks/use-connected-accounts"
import { useMe } from "@/hooks/use-me"
import { useMyKeys } from "@/hooks/use-my-keys"

function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function formatUnixTimestamp(timestamp: number): string {
	// Handle both seconds and milliseconds timestamps
	const date = timestamp > 10_000_000_000 ? new Date(timestamp) : new Date(timestamp * 1000)
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
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

/**
 * Identity on the left, what SSHark holds for you on the right. The previous layout centred a
 * huge avatar in a tall empty box and repeated the name three times over; this keeps the same
 * information within one screenful.
 */
function ProfileHeader() {
	const { user } = useUser()
	const { primaryAccount } = useConnectedAccounts()
	const { data: keys } = useMyKeys()
	const { data: me } = useMe()

	if (!user) {
		return null
	}

	const handle = primaryAccount?.username
	const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
	const displayName = fullName || me?.username || handle || "Your profile"
	const initials =
		[user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
		(me?.username ?? handle)?.[0]?.toUpperCase() ||
		"U"

	return (
		<PageSection>
			<div className="rounded-2xl border border-border bg-linear-to-br from-muted/40 to-muted/10 p-6 md:p-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex min-w-0 flex-1 items-center gap-5">
						<Avatar className="h-20 w-20 shrink-0 border-2 border-background shadow-md md:h-24 md:w-24">
							<AvatarImage alt={displayName} src={user.imageUrl} />
							<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
						</Avatar>

						<div className="min-w-0 space-y-2">
							<h1 className="truncate font-bold text-2xl tracking-tight md:text-3xl">{displayName}</h1>

							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
								{me?.profile_url && (
									<a
										className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary hover:underline"
										href={me.profile_url}
										rel="noopener"
										target="_blank">
										{me.profile_url}
										<ExternalLink className="h-3 w-3" />
									</a>
								)}
								{handle && primaryAccount && (
									<span className="inline-flex items-center gap-1">
										<ProviderIcon className="h-3.5 w-3.5" provider={primaryAccount.provider} />@
										{handle}
									</span>
								)}
								{user.primaryEmailAddress?.emailAddress && (
									<span className="inline-flex items-center gap-1">
										<Mail className="h-3.5 w-3.5" />
										{user.primaryEmailAddress.emailAddress}
									</span>
								)}
							</div>

							<div className="flex flex-wrap items-center gap-2">
								{primaryAccount && (
									<Badge variant="secondary">
										<Shield className="mr-1 h-3 w-3" />
										Verified
									</Badge>
								)}
								{user.createdAt && (
									<Badge variant="outline">
										<Calendar className="mr-1 h-3 w-3" />
										Joined {formatDate(user.createdAt.getTime())}
									</Badge>
								)}
							</div>
						</div>
					</div>

					<div className="grid shrink-0 grid-cols-3 gap-3">
						<StatTile icon={Key} label="SSH keys" value={keys?.ssh_keys.length ?? 0} />
						<StatTile icon={ShieldCheck} label="GPG keys" value={keys?.gpg_keys.length ?? 0} />
						<StatTile icon={Shield} label="Providers" value={keys?.accounts.length ?? 0} />
					</div>
				</div>
			</div>
		</PageSection>
	)
}

function CreateApiKeyDialog() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [secret, setSecret] = useState<string | null>(null)
	const { mutate: createApiKey, isPending } = useCreateApiKey()

	const handleCreate = () => {
		createApiKey(
			{ name, description: description || undefined },
			{
				onSuccess: (data) => {
					setSecret(data.secret)
					setName("")
					setDescription("")
					toast.success("API Key Created", {
						description:
							"Your API key has been created successfully. Make sure to copy it now as it won't be shown again.",
					})
				},
				onError: (error) => {
					toast.error("Error", {
						description: error instanceof Error ? error.message : "Failed to create API key",
					})
				},
			},
		)
	}

	const copySecret = () => {
		if (secret) {
			navigator.clipboard.writeText(secret)
			toast.success("Copied", {
				description: "API key copied to clipboard",
			})
		}
	}

	const handleClose = () => {
		setOpen(false)
		setSecret(null)
		setName("")
		setDescription("")
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) {
					handleClose()
				}
			}}
			open={open}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="mr-2 h-4 w-4" />
					Create API Key
				</Button>
			</DialogTrigger>
			<DialogContent>
				{secret ? (
					<>
						<DialogHeader>
							<DialogTitle>API Key Created</DialogTitle>
							<DialogDescription>
								Make sure to copy your API key now. You won't be able to see it again!
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="flex items-center gap-2">
								<Input className="font-mono text-xs" readOnly value={secret} />
								<Button onClick={copySecret} size="icon" variant="outline">
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={handleClose}>Done</Button>
						</DialogFooter>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Create API Key</DialogTitle>
							<DialogDescription>
								Create a new API key to access the SSHark API programmatically.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									onChange={(e) => setName(e.target.value)}
									placeholder="My API Key"
									value={name}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="description">Description (optional)</Label>
								<Textarea
									id="description"
									onChange={(e) => setDescription(e.target.value)}
									placeholder="API key for my application"
									value={description}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={handleClose} variant="outline">
								Cancel
							</Button>
							<Button disabled={!name || isPending} onClick={handleCreate}>
								{isPending ? "Creating..." : "Create"}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

function ApiKeyRow({
	apiKey,
}: {
	apiKey: {
		id: string
		name: string
		description?: string
		created_at: number
		last_used_at?: number
		expired: boolean
		revoked: boolean
	}
}) {
	const { mutate: deleteApiKey, isPending } = useDeleteApiKey()

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
			deleteApiKey(apiKey.id, {
				onSuccess: () => {
					toast.success("API Key Deleted", {
						description: "Your API key has been deleted successfully.",
					})
				},
				onError: (error) => {
					toast.error("Error", {
						description: error instanceof Error ? error.message : "Failed to delete API key",
					})
				},
			})
		}
	}

	return (
		<TableRow>
			<TableCell>
				<div>
					<div className="font-medium">{apiKey.name}</div>
					{apiKey.description && <div className="text-muted-foreground text-xs">{apiKey.description}</div>}
				</div>
			</TableCell>
			<TableCell>
				<code className="text-muted-foreground text-xs">{apiKey.id}</code>
			</TableCell>
			<TableCell>
				<div className="flex gap-2">
					{apiKey.revoked && <Badge variant="destructive">Revoked</Badge>}
					{apiKey.expired && <Badge variant="secondary">Expired</Badge>}
					{!(apiKey.revoked || apiKey.expired) && <Badge variant="outline">Active</Badge>}
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground text-xs">{formatUnixTimestamp(apiKey.created_at)}</TableCell>
			<TableCell className="text-muted-foreground text-xs">
				{apiKey.last_used_at ? formatUnixTimestamp(apiKey.last_used_at) : "Never"}
			</TableCell>
			<TableCell>
				<Button disabled={isPending} onClick={handleDelete} size="sm" variant="ghost">
					<Trash2 className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	)
}

function ApiKeysSection() {
	const { data, isLoading } = useApiKeys()

	if (isLoading) {
		return (
			<section className="mx-4 mt-6 md:mx-6">
				<Skeleton className="h-64 w-full rounded-xl" />
			</section>
		)
	}

	const apiKeys = data?.api_keys || []

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>API Keys</PageSectionTitle>
				<PageSectionParagraph>
					Manage your API keys to access the SSHark API programmatically.
				</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				<div className="mb-6 flex items-center justify-end">
					<CreateApiKeyDialog />
				</div>
				{apiKeys.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Key className="mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">No API Keys</h3>
							<p className="mb-4 text-center text-muted-foreground text-sm">
								You haven't created any API keys yet. Create one to start using the API.
							</p>
							<CreateApiKeyDialog />
						</CardContent>
					</Card>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>API Key ID</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Last Used</TableHead>
									<TableHead className="w-[50px]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{apiKeys.map((apiKey) => (
									<ApiKeyRow apiKey={apiKey} key={apiKey.id} />
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</PageSectionContent>
		</PageSection>
	)
}

function ProfileSkeleton() {
	return (
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-16">
					<div className="mx-auto max-w-2xl px-4 text-center">
						<Skeleton className="mx-auto h-32 w-32 rounded-full" />
						<Skeleton className="mx-auto mt-6 h-8 w-48" />
						<Skeleton className="mx-auto mt-2 h-5 w-32" />
						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							<Skeleton className="h-20 w-full rounded-lg" />
							<Skeleton className="h-20 w-full rounded-lg" />
							<Skeleton className="h-20 w-full rounded-lg" />
							<Skeleton className="h-20 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

function ProfileNotAuthenticated() {
	return <RedirectToSignIn />
}

export default function Profile() {
	const { isLoaded, isSignedIn, user } = useUser()

	if (!isLoaded) {
		return <ProfileSkeleton />
	}

	if (!(isSignedIn && user)) {
		return <ProfileNotAuthenticated />
	}

	return (
		<Page>
			<ProfileHeader />
			<UsernameSection />
			<ConnectedAccountsSection />
			<MyKeysSection />
			<TasksSection />
			<ApiKeysSection />
			<DeleteAccountSection />
		</Page>
	)
}
