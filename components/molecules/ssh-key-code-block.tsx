interface SSHKeyCodeBlockProps {
	/** Base64 of the complete authorized_keys line, as the API returns it. */
	keyContent: string
}

/**
 * Decodes a key back to the line the provider published.
 *
 * The API base64-encodes the whole line — algorithm, key material and comment — so the
 * algorithm must not be prepended again. Doing that produced `ssh-ed25519 c3NoLWVk...`, which
 * looks like a key but is not one.
 */
function decodeKeyLine(keyContent: string): string {
	try {
		if (typeof atob === "function") {
			return atob(keyContent).trim()
		}
		return Buffer.from(keyContent, "base64").toString("utf-8").trim()
	} catch {
		return keyContent
	}
}

export function SSHKeyCodeBlock({ keyContent }: SSHKeyCodeBlockProps) {
	return (
		<div className="overflow-x-auto">
			<code className="block break-all rounded bg-muted px-3 py-2 font-mono text-foreground text-xs">
				{decodeKeyLine(keyContent)}
			</code>
		</div>
	)
}
