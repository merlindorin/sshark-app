"use client"

import { useRouter } from "next/navigation"
import { type GPGKey, GPGKeyCard } from "@/components/organisms/gpg-key-card"
import { SSHKeyCard } from "@/components/organisms/ssh-key-card"
import type { SearchField } from "@/components/organisms/ssh-key-search"
import type { SSHKey } from "@/hooks/use-ssh-keys"

/**
 * Renders a profile's keys with the same cards Explore uses, so a key looks and behaves the
 * same wherever you meet it — including the pills, which search here too.
 */
export function ProfileKeyList({ sshKeys, gpgKeys }: { sshKeys?: SSHKey[]; gpgKeys?: GPGKey[] }) {
	const router = useRouter()

	const handleSearchClick = (query: string, field: SearchField) => {
		router.push(`/explore/${query}?fields=${field}`)
	}

	return (
		<div className="space-y-4">
			{sshKeys?.map((sshKey) => (
				<SSHKeyCard key={sshKey.id} onSearchClick={handleSearchClick} sshKey={sshKey} />
			))}
			{gpgKeys?.map((gpgKey) => (
				<GPGKeyCard gpgKey={gpgKey} key={gpgKey.id} />
			))}
		</div>
	)
}
