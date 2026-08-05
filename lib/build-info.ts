/** Length git uses for an abbreviated hash. */
const SHORT_SHA_LENGTH = 7

/**
 * The commit this build came from, abbreviated, or undefined when it is not known.
 *
 * NEXT_PUBLIC_COMMIT_SHA is inlined at build time — it cannot be injected into a running
 * container — so it is set by the Docker build from the workflow's github.sha. A local `npm run
 * dev` has no value, and the footer simply omits it rather than showing a placeholder.
 */
export function commitShortSha(): string | undefined {
	const sha = process.env.NEXT_PUBLIC_COMMIT_SHA?.trim()
	if (!sha) {
		return undefined
	}

	return sha.slice(0, SHORT_SHA_LENGTH)
}
