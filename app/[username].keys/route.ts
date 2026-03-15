import { type NextRequest, NextResponse } from "next/server"
import { isReservedUsername } from "@/lib/reserved-usernames"

interface Source {
	id?: string
	provider: string
	user_id?: string
	username: string
	uri?: string
}

interface SSHKey {
	id: string
	fingerprint: string
	key_data: string
	algorithm: string
	comment?: string
	key_bits?: number
	created_at: string
	updated_at: string
	source?: Source
}

interface SearchResponse {
	entities: SSHKey[]
	total: number
	limit: number
	offset: number
	duration: number
	query: string
}

export async function GET(_request: NextRequest, context: { params: Promise<Record<string, string>> }) {
	const resolvedParams = await context.params
	const username = resolvedParams.username

	if (!username || isReservedUsername(username)) {
		return new NextResponse("Not Found", { status: 404 })
	}

	try {
		const searchQuery = `@source.username:{${username}}`
		const apiBaseUrl = process.env.API_URL || "http://localhost:8080"
		const params = new URLSearchParams({
			q: searchQuery,
			limit: "100",
			offset: "0",
		})
		const apiUrl = `${apiBaseUrl}/api/v1/ssh/search?${params.toString()}`

		const response = await fetch(apiUrl)

		if (!response.ok) {
			return new NextResponse("Error fetching SSH keys", { status: response.status })
		}

		const data: SearchResponse = await response.json()

		const authorizedKeys = data.entities
			.map((key) => {
				const comment = key.comment ? ` ${key.comment}` : ""
				return `${key.algorithm} ${key.key_data}${comment}`
			})
			.join("\n")

		return new NextResponse(authorizedKeys, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Content-Disposition": `inline; filename="${username}.keys"`,
			},
		})
	} catch (error) {
		console.error("Error fetching SSH keys:", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}
