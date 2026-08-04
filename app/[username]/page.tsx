import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AccountProfileView } from "@/components/pages/account-profile"
import { UsernameKeysView } from "@/components/pages/username-keys"
import { accountUsernameFrom, fetchPublicProfile } from "@/lib/public-profile"

interface PageProps {
	params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { username } = await params
	const account = accountUsernameFrom(username)

	if (!account) {
		const title = `@${decodeURIComponent(username)} — public SSH keys`
		return {
			title,
			description: `Public SSH keys indexed by SShark under the name ${decodeURIComponent(username)}.`,
			openGraph: { title },
		}
	}

	const profile = await fetchPublicProfile(account)
	if (!profile) {
		return { title: "Profile not found" }
	}

	const title = `${profile.display_name ?? `@${profile.username}`} — SShark`
	return {
		title,
		description: `SSH and GPG keys published by @${profile.username} on SShark.`,
		openGraph: { title },
	}
}

/**
 * One dynamic segment serves two things: /@merlin is an SShark account someone claimed, and
 * /merlin is whatever SShark scraped under that name. They are deliberately different pages,
 * because only the first proves the keys belong to the person you are looking at.
 */
export default async function UsernamePage({ params }: PageProps) {
	const { username } = await params
	const account = accountUsernameFrom(username)

	if (!account) {
		return <UsernameKeysView username={decodeURIComponent(username)} />
	}

	const profile = await fetchPublicProfile(account)
	if (!profile) {
		notFound()
	}

	return <AccountProfileView profile={profile} />
}
