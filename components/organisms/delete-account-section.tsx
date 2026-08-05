"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
	PageSection,
	PageSectionContent,
	PageSectionHeader,
	PageSectionParagraph,
	PageSectionTitle,
} from "@/components/pages/page"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { clerkErrorMessage } from "@/hooks/use-connected-accounts"
import { useDeleteProfile } from "@/hooks/use-me"

/**
 * Typing this is the deliberate step between "clicked delete" and a gone account. Kept to one
 * short word: a longer phrase reads as a sentence in the label, and people type the first word
 * then wonder why nothing happens.
 */
const CONFIRMATION_PHRASE = "delete"

export function DeleteAccountSection() {
	const { user, isLoaded } = useUser()
	const { signOut } = useClerk()
	const { mutateAsync: releaseProfile } = useDeleteProfile()
	const [open, setOpen] = useState(false)
	const [confirmation, setConfirmation] = useState("")
	const [isDeleting, setIsDeleting] = useState(false)

	if (!(isLoaded && user?.deleteSelfEnabled)) {
		return null
	}

	const close = () => {
		setOpen(false)
		setConfirmation("")
	}

	const canConfirm = confirmation.trim().toLowerCase() === CONFIRMATION_PHRASE

	const handleDelete = async () => {
		setIsDeleting(true)

		try {
			// Release the SSHark profile first. Clerk owns the account but not the username, so
			// deleting the account alone would leave the name held by a profile with no owner.
			await releaseProfile()
			await user.delete()
			// The session outlives the user record, so end it explicitly rather than leaving the
			// app holding a token for an account that no longer exists.
			await signOut({ redirectUrl: "/" })
		} catch (error) {
			setIsDeleting(false)
			toast.error("Could not delete your account", {
				description: clerkErrorMessage(error, "Please try again."),
			})
		}
	}

	return (
		<PageSection>
			<PageSectionHeader>
				<PageSectionTitle>Danger Zone</PageSectionTitle>
				<PageSectionParagraph>Irreversible actions on your SSHark account.</PageSectionParagraph>
			</PageSectionHeader>
			<PageSectionContent>
				<Card className="border-destructive/50">
					<CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
						<div className="flex items-start gap-3">
							<TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
							<div>
								<p className="font-medium text-sm">Delete your account</p>
								<p className="text-muted-foreground text-sm">
									Removes your SSHark account, your username, every connected provider and all your
									API keys. Your public keys stay where they are at GitHub and GitLab.
								</p>
							</div>
						</div>
						<Button onClick={() => setOpen(true)} variant="destructive">
							Delete account
						</Button>
					</CardContent>
				</Card>

				<Dialog
					onOpenChange={(next) => {
						if (!next) {
							close()
						}
					}}
					open={open}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete your account?</DialogTitle>
							<DialogDescription>
								This cannot be undone. Your connected providers and API keys are removed, and any
								service using those API keys stops working immediately.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-2 py-2">
							<Label htmlFor="delete-confirmation">
								Type{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
									{CONFIRMATION_PHRASE}
								</code>{" "}
								to confirm
							</Label>
							<Input
								aria-describedby="delete-confirmation-hint"
								autoComplete="off"
								id="delete-confirmation"
								onChange={(event) => setConfirmation(event.target.value)}
								spellCheck={false}
								value={confirmation}
							/>
							{/* Without this the button is simply dead, with nothing saying why. */}
							<p className="text-muted-foreground text-xs" id="delete-confirmation-hint">
								{canConfirm
									? "This cannot be undone."
									: `Type "${CONFIRMATION_PHRASE}" above to enable the button.`}
							</p>
						</div>
						<DialogFooter>
							<Button disabled={isDeleting} onClick={close} variant="outline">
								Cancel
							</Button>
							<Button disabled={isDeleting || !canConfirm} onClick={handleDelete} variant="destructive">
								{isDeleting ? "Deleting..." : "Delete my account"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</PageSectionContent>
		</PageSection>
	)
}
