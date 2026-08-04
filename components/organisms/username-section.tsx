"use client"

import { AtSign, Check, ExternalLink, Loader2, X } from "lucide-react"
import { useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import {
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionTitle,
} from "@/components/pages/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useCheckUsername, useMe, useSetUsername } from "@/hooks/use-me"

/** Long enough that a fast typist stops before we ask the server. */
const AVAILABILITY_DEBOUNCE_MS = 400

function errorMessage(error: unknown, fallback: string): string {
	if (error && typeof error === "object" && "error" in error) {
		const detail = (error as { error?: { message?: string; details?: string } }).error
		if (detail?.message) {
			return detail.details ? `${detail.message}: ${detail.details}` : detail.message
		}
	}
	if (error instanceof Error) {
		return error.message
	}
	return fallback
}

export function UsernameSection() {
	const { data: me, isLoading } = useMe()
	const { mutate: check, data: availability, reset: resetAvailability, isPending: isChecking } = useCheckUsername()
	const { mutate: save, isPending: isSaving, error: saveError, reset: resetSave } = useSetUsername()

	const [draft, setDraft] = useState<string | null>(null)
	const [saved, setSaved] = useState(false)

	const current = me?.username ?? ""
	const value = draft ?? current
	const isDirty = draft !== null && draft !== current

	const checkDebounced = useDebounceCallback((next: string) => {
		if (next && next !== current) {
			check(next)
		}
	}, AVAILABILITY_DEBOUNCE_MS)

	const handleChange = (next: string) => {
		setDraft(next)
		setSaved(false)
		resetAvailability()
		resetSave()
		checkDebounced(next)
	}

	const handleSave = () => {
		if (!isDirty) {
			return
		}

		save(value, {
			onSuccess: () => {
				setDraft(null)
				setSaved(true)
				resetAvailability()
			},
		})
	}

	if (isLoading) {
		return (
			<PageSection>
				<Skeleton className="h-40 w-full rounded-xl" />
			</PageSection>
		)
	}

	const showsAvailability = isDirty && availability?.username === value
	const canSave = isDirty && !isSaving && (availability?.available ?? false)

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>Your Username</PageSectionTitle>
				<PageSectionParagraph>
					The name your public profile is served from. It started as your first connected provider login;
					change it to anything nobody else holds.
				</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				<div className="max-w-xl space-y-3">
					<Label htmlFor="sshark-username">Username</Label>
					<div className="flex flex-wrap items-center gap-2">
						<div className="relative min-w-64 flex-1">
							<AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								autoComplete="off"
								className="pl-9"
								id="sshark-username"
								onChange={(event) => handleChange(event.target.value)}
								placeholder="your-name"
								spellCheck={false}
								value={value}
							/>
						</div>
						<Button disabled={!canSave} onClick={handleSave}>
							{isSaving ? "Saving..." : "Save"}
						</Button>
						{me?.profile_url && !isDirty && (
							<Button asChild variant="outline">
								<a href={me.profile_url} rel="noopener" target="_blank">
									View profile
									<ExternalLink className="ml-2 h-4 w-4" />
								</a>
							</Button>
						)}
					</div>

					{isChecking && isDirty && (
						<p className="flex items-center gap-1.5 text-muted-foreground text-sm">
							<Loader2 className="h-4 w-4 animate-spin" />
							Checking availability...
						</p>
					)}

					{showsAvailability && !isChecking && availability?.available && (
						<p className="flex items-center gap-1.5 text-green-500 text-sm">
							<Check className="h-4 w-4" />
							{value} is available
						</p>
					)}

					{showsAvailability && !isChecking && availability && !availability.available && (
						<p className="flex items-center gap-1.5 text-destructive text-sm">
							<X className="h-4 w-4" />
							{availability.reason ?? "This username is not available."}
						</p>
					)}

					{saveError && (
						<p className="text-destructive text-sm">
							{errorMessage(saveError, "Could not save your username.")}
						</p>
					)}

					{saved && !isDirty && (
						<p className="flex items-center gap-1.5 text-green-500 text-sm">
							<Check className="h-4 w-4" />
							Saved. Your profile is at {me?.profile_url}
						</p>
					)}

					{!(isDirty || saved) && me?.profile_url && (
						<p className="text-muted-foreground text-sm">
							Your profile is at <code className="text-foreground">sshark.app{me.profile_url}</code>
						</p>
					)}
				</div>
			</PageSectionContent>
		</PageSection>
	)
}
