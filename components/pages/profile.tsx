"use client"

import { RedirectToSignIn, useUser } from "@clerk/nextjs"
import { Calendar, Copy, Key, Mail, Plus, Shield, Trash2, User } from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
	Page,
	PageHeaderHero,
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

function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: ComponentType<{ className?: string }>
	label: string
	value: string | null | undefined
}) {
	if (!value) {
		return null
	}
	return (
		<div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 px-4 py-3">
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
				<Icon className="h-5 w-5 text-accent" />
			</div>
			<div>
				<p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	)
}

function StatItem({
	label,
	value,
	icon: Icon,
}: {
	label: string
	value: string | number
	icon: ComponentType<{ className?: string }>
}) {
	return (
		<div className="flex flex-col items-center gap-1 text-center">
			<Icon className="h-5 w-5 text-accent" />
			<p className="font-bold text-2xl">{value}</p>
			<p className="text-muted-foreground text-xs">{label}</p>
		</div>
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

	const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
	const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U"

	return (
		<Page>
			<PageHeaderHero>
				<div className="text-center">
					<Avatar className="mx-auto h-32 w-32 border-4 border-background shadow-xl">
						<AvatarImage alt={fullName || user.username || "User"} src={user.imageUrl} />
						<AvatarFallback className="text-4xl">{initials}</AvatarFallback>
					</Avatar>
					<h1 className="mt-6 font-bold text-3xl tracking-tight">{fullName || user.username}</h1>
					{user.username && <p className="mt-1 text-lg text-muted-foreground">@{user.username}</p>}
					<div className="mt-4 flex justify-center gap-2">
						<Badge variant="secondary">
							<Shield className="mr-1 h-3 w-3" />
							Verified
						</Badge>
						{user.createdAt && (
							<Badge variant="outline">
								<Calendar className="mr-1 h-3 w-3" />
								Joined {formatDate(user.createdAt.getTime())}
							</Badge>
						)}
					</div>
				</div>

				{/* Stats */}
				<div className="mt-10 flex items-center justify-center gap-8 rounded-xl border border-border/50 bg-background/50 p-6">
					<StatItem icon={Key} label="SSH Keys" value={0} />
					<div className="h-12 w-px bg-border" />
					<StatItem icon={Shield} label="Providers" value={0} />
				</div>

				{/* Info Grid */}
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<InfoItem icon={Mail} label="Email" value={user.primaryEmailAddress?.emailAddress} />
					<InfoItem icon={User} label="Username" value={user.username} />
					<InfoItem icon={User} label="First Name" value={user.firstName} />
					<InfoItem icon={User} label="Last Name" value={user.lastName} />
				</div>
			</PageHeaderHero>
			<ApiKeysSection />
		</Page>
	)
}
