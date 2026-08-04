import { type NextRequest, NextResponse } from "next/server"
import { accountUsernameFrom, decodeKeyData, fetchPublicProfile, type ProfileKey } from "@/lib/public-profile"
import { isReservedUsername } from "@/lib/reserved-usernames"

interface Source {
	provider: string
	username: string
}

interface SSHKey {
	id: string
	fingerprint: string
	/** Base64 of the complete authorized_keys line. */
	key_data: string
	algorithm: string
	comment?: string
	source?: Source
}

interface SearchResponse {
	entities: SSHKey[]
	total: number
}

const PLAIN_TEXT_HEADERS = (filename: string) => ({
	"Content-Type": "text/plain; charset=utf-8",
	"Content-Disposition": `inline; filename="${filename}"`,
})

/**
 * Renders keys one per line, dropping any that fail to decode rather than emitting garbage.
 * The trailing newline matters: appending this to an authorized_keys file without one would
 * glue the last key onto whatever follows.
 */
function toAuthorizedKeys(keys: Array<{ key_data: string }>): string {
	const lines = keys.map((key) => decodeKeyData(key.key_data)).filter(Boolean)

	return lines.length > 0 ? `${lines.join("\n")}\n` : ""
}

async function searchKeysByUsername(username: string): Promise<SearchResponse | null> {
	const apiBaseUrl = process.env.API_URL || "http://localhost:8080"
	const params = new URLSearchParams({
		q: `@source.username:{${username}}`,
		limit: "100",
		offset: "0",
	})

	const response = await fetch(`${apiBaseUrl}/api/v1/ssh/search?${params.toString()}`)
	if (!response.ok) {
		return null
	}

	return (await response.json()) as SearchResponse
}

/**
 * Serves authorized_keys for either addressing scheme: /@merlin.keys is the account someone
 * claimed and only carries keys from providers they proved they own, while /merlin.keys is
 * everything SShark scraped under that name.
 */
export async function GET(_request: NextRequest, context: { params: Promise<Record<string, string>> }) {
	const resolvedParams = await context.params
	const segment = resolvedParams.username

	if (!segment) {
		return new NextResponse("Not Found", { status: 404 })
	}

	const account = accountUsernameFrom(segment)

	try {
		if (account) {
			const profile = await fetchPublicProfile(account)
			if (!profile) {
				return new NextResponse("Not Found", { status: 404 })
			}

			return new NextResponse(toAuthorizedKeys(profile.ssh_keys as ProfileKey[]), {
				status: 200,
				headers: PLAIN_TEXT_HEADERS(`${profile.username}.keys`),
			})
		}

		const username = decodeURIComponent(segment)
		if (isReservedUsername(username)) {
			return new NextResponse("Not Found", { status: 404 })
		}

		const data = await searchKeysByUsername(username)
		if (!data) {
			return new NextResponse("Error fetching SSH keys", { status: 502 })
		}

		return new NextResponse(toAuthorizedKeys(data.entities), {
			status: 200,
			headers: PLAIN_TEXT_HEADERS(`${username}.keys`),
		})
	} catch {
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}
