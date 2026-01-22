"use client"

import { RedirectToSignIn, useUser } from "@clerk/nextjs"
import { Calendar, Key, Mail, Shield, User } from "lucide-react"
import type { ComponentType } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
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
		<main className="mt-(--fd-nav-height) w-full pt-4">
			<section className="relative mx-4 overflow-hidden rounded-2xl border border-accent bg-linear-to-b from-muted/30 to-muted/80 md:mx-6">
				<div className="relative z-10 py-12 md:py-16">
					<div className="mx-auto max-w-2xl px-4">
						{/* Profile Header */}
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
					</div>
				</div>
			</section>
		</main>
	)
}
