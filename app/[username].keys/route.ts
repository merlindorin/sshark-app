import { type NextRequest, NextResponse } from "next/server"
import { isReservedUsername } from "@/lib/reserved-usernames"

interface SSHKey {
	id: string
	username: string
	source: string
	provider: string
	key: string
	options: string[]
	comment: string
	type: string
	updated_at: string
}

interface SearchResponse {
	entities: SSHKey[][]
	total: number
	limit: number
	offset: number
	duration: number
}

export async function GET(_request: NextRequest, context: { params: Promise<Record<string, string>> }) {
	const resolvedParams = await context.params
	const username = resolvedParams.username

	if (!username || isReservedUsername(username)) {
		return new NextResponse("Not Found", { status: 404 })
	}

	try {
		const searchQuery = `@username:{${username}}`
		const apiBaseUrl = process.env.API_URL || "http://localhost:8080"
		const apiUrl = `${apiBaseUrl}/api/v1/search/${encodeURIComponent(searchQuery)}?limit=100&offset=0`

		const response = await fetch(apiUrl)

		if (!response.ok) {
			return new NextResponse("Error fetching SSH keys", { status: response.status })
		}

		const data: SearchResponse = await response.json()
		const sshKeys = data.entities.flat()

		const authorizedKeys = sshKeys
			.map((key) => {
				const optionsStr = key.options.length > 0 ? `${key.options.join(",")} ` : ""
				const comment = key.comment ? ` ${key.comment}` : ""
				return `${optionsStr}${key.type} ${key.key}${comment}`
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
