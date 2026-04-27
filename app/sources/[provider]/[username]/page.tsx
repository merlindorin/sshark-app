import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { type SourceDetail, SourceView } from "@/components/pages/source"

export const revalidate = 3600
export const dynamicParams = true

const SUPPORTED_PROVIDERS = new Set(["github", "gitlab"])

interface PageProps {
	params: Promise<{ provider: string; username: string }>
}

async function fetchSource(provider: string, username: string): Promise<SourceDetail | null> {
	const apiBaseUrl = process.env.API_URL || "http://localhost:8080"
	const url = `${apiBaseUrl}/api/v1/sources/${encodeURIComponent(provider)}/${encodeURIComponent(username)}`
	const res = await fetch(url, {
		next: { revalidate: 3600, tags: [`source:${provider}:${username}`] },
	})
	if (res.status === 404) {
		return null
	}
	if (!res.ok) {
		throw new Error(`upstream ${res.status} fetching ${url}`)
	}
	return (await res.json()) as SourceDetail
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { provider, username } = await params
	const title = `@${username} on ${provider} — SSH & GPG keys`
	return {
		title,
		description: `Public SSH and GPG keys indexed by SShark for ${username} on ${provider}.`,
		openGraph: { title },
	}
}

export default async function SourcePage({ params }: PageProps) {
	const { provider, username } = await params
	if (!SUPPORTED_PROVIDERS.has(provider)) {
		notFound()
	}

	const source = await fetchSource(provider, username)
	if (!source) {
		notFound()
	}

	return <SourceView source={source} />
}
