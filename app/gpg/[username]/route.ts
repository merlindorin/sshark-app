import { type NextRequest, NextResponse } from "next/server"
import { accountUsernameFrom, decodeKeyData, fetchPublicProfile } from "@/lib/public-profile"

/**
 * Serves the armored GPG public keys of an SShark account, so they can be piped straight into
 * `gpg --import`. Only accounts are addressable here: a GPG key is worth importing because
 * someone proved the account is theirs, which /username cannot establish.
 */
export async function GET(_request: NextRequest, context: { params: Promise<Record<string, string>> }) {
	const resolvedParams = await context.params
	const segment = resolvedParams.username

	if (!segment) {
		return new NextResponse("Not Found", { status: 404 })
	}

	const account = accountUsernameFrom(segment)
	if (!account) {
		return new NextResponse("Not Found — GPG keys are served for SShark accounts only, at /@username.gpg\n", {
			status: 404,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		})
	}

	try {
		const profile = await fetchPublicProfile(account)
		if (!profile) {
			return new NextResponse("Not Found", { status: 404 })
		}

		// Armored blocks are already self-delimiting, so concatenating them is a valid keyring.
		const armored = profile.gpg_keys
			.map((key) => decodeKeyData(key.key_data))
			.filter(Boolean)
			.join("\n")

		return new NextResponse(armored ? `${armored}\n` : "", {
			status: 200,
			headers: {
				"Content-Type": "application/pgp-keys; charset=utf-8",
				"Content-Disposition": `inline; filename="${profile.username}.gpg"`,
			},
		})
	} catch {
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}
