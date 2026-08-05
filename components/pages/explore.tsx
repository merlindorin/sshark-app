"use client"

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Github,
	Key,
	Search,
	Server,
	Shield,
	Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useMemo } from "react"
import { GPGKeyCard } from "@/components/organisms/gpg-key-card"
import { KeySearch, type ResultsPerPage, type SearchField } from "@/components/organisms/key-search"
import { SSHKeyCard } from "@/components/organisms/ssh-key-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { GPGKey, SSHKey } from "@/hooks/use-keys"
import { useKeys } from "@/hooks/use-keys"
import { DEFAULT_KEY_TYPE, type KeyType, type SSHSearchField } from "@/lib/key-search-config"
import { cn } from "@/lib/utils"

interface ExploreProps {
	keyType: KeyType
	query: string
	searchQuery: string
	selectedFields: SearchField[]
	isAdvancedSearch: boolean
	resultsPerPage: ResultsPerPage
	currentPage: number
	onKeyTypeChange: (keyType: KeyType) => void
	onQueryChange: (query: string) => void
	onSelectedFieldsChange: (fields: SearchField[]) => void
	onAdvancedSearchChange: (isAdvanced: boolean) => void
	onResultsPerPageChange: (resultsPerPage: ResultsPerPage) => void
	onPageChange: (page: number) => void
	onSearch: () => void
}

interface SearchSuggestion {
	label: string
	query: string
	fields?: SSHSearchField[]
	isAdvanced?: boolean
	icon: React.ReactNode
	keyType?: KeyType
}

const searchSuggestions: SearchSuggestion[] = [
	{
		label: "GitHub keys",
		query: "github",
		fields: ["source.provider"],
		icon: <Github className="h-5 w-5" />,
		keyType: "ssh",
	},
	{
		label: "GitLab keys",
		query: "gitlab",
		fields: ["source.provider"],
		icon: <Server className="h-5 w-5" />,
		keyType: "ssh",
	},
	{
		label: "RSA keys",
		query: "ssh-rsa",
		fields: ["algorithm"],
		icon: <Shield className="h-5 w-5" />,
		keyType: "ssh",
	},
	{
		label: "ED25519 keys",
		query: "ssh-ed25519",
		fields: ["algorithm"],
		icon: <Key className="h-5 w-5" />,
		keyType: "ssh",
	},
	{
		label: "Search by username",
		query: "merlin",
		fields: ["source.username"],
		icon: <Search className="h-5 w-5" />,
	},
	{
		label: "Advanced search",
		query: "@algorithm:{ssh-rsa} & @source.provider:{github}",
		isAdvanced: true,
		icon: <Sparkles className="h-5 w-5" />,
		keyType: "ssh",
	},
]

const formatCount = (value: number) => value.toLocaleString("en-US")

const NANOSECONDS_PER_MS = 1_000_000
const MS_PER_SECOND = 1000

/**
 * Renders how long the search took. The API reports nanoseconds; a sub-millisecond result
 * still deserves a number rather than rounding to a bare "0ms".
 */
function formatDuration(nanoseconds: number): string {
	const milliseconds = nanoseconds / NANOSECONDS_PER_MS

	if (milliseconds >= MS_PER_SECOND) {
		return `${(milliseconds / MS_PER_SECOND).toFixed(2)}s`
	}
	if (milliseconds < 1) {
		return `${milliseconds.toFixed(2)}ms`
	}
	return `${Math.round(milliseconds)}ms`
}

type PageItem = number | "ellipsis-start" | "ellipsis-end"

function generatePageNumbers(current: number, total: number): PageItem[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	if (current <= 3) {
		return [1, 2, 3, 4, 5, "ellipsis-end", total]
	}

	if (current >= total - 2) {
		return [1, "ellipsis-start", total - 4, total - 3, total - 2, total - 1, total]
	}

	return [1, "ellipsis-start", current - 1, current, current + 1, "ellipsis-end", total]
}

/** How many placeholder cards to show while the first page of results loads. */
const SKELETON_CARDS = 4

function SearchSkeleton({ count }: { count: number }) {
	return (
		<output aria-busy="true" aria-label="Searching for SSH keys" className="mt-8 block space-y-4">
			{Array.from({ length: count }, (_, index) => `skeleton-${index}`).map((key) => (
				<div className="space-y-3 rounded-lg border border-border bg-background p-4" key={key}>
					<div className="flex items-center justify-between gap-4">
						<div className="flex grow items-center gap-1">
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-28 rounded-full" />
							<Skeleton className="h-6 w-24 rounded-full" />
						</div>
						<Skeleton className="h-6 w-12" />
					</div>
					<Skeleton className="h-9 w-full" />
				</div>
			))}
		</output>
	)
}

function EmptyResults({
	keyType,
	hasSearchQuery,
	onSuggestionClick,
}: {
	keyType: KeyType
	hasSearchQuery: boolean
	onSuggestionClick: (suggestion: SearchSuggestion) => void
}) {
	const keyTypeLabel = keyType === "ssh" ? "SSH keys" : "GPG keys"
	const filteredSuggestions = searchSuggestions.filter((s) => !s.keyType || s.keyType === keyType)

	return (
		<div className="mt-8 rounded-lg border border-border border-dashed">
			<div className="flex flex-col items-center gap-6 p-8 text-center">
				<div className="flex flex-col items-center gap-2">
					<Key className="h-10 w-10 text-muted-foreground" />
					<p className="font-medium text-foreground text-lg">
						{hasSearchQuery ? `No ${keyTypeLabel} found` : `Start searching for ${keyTypeLabel}`}
					</p>
					<p className="text-muted-foreground text-sm">Try one of these search suggestions</p>
				</div>

				<div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
					{filteredSuggestions.map((suggestion) => (
						<button
							className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:border-primary hover:bg-muted/50"
							key={suggestion.label}
							onClick={() => onSuggestionClick(suggestion)}
							type="button">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
								{suggestion.icon}
							</div>
							<span className="font-medium text-foreground text-sm">{suggestion.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

function ExploreResults({
	keyType,
	keys,
	isSearching,
	hasSearchQuery,
	resultsPerPage,
	onSearchClick,
	onSuggestionClick,
}: {
	keyType: KeyType
	keys: (SSHKey | GPGKey)[]
	isSearching: boolean
	hasSearchQuery: boolean
	resultsPerPage: ResultsPerPage
	onSearchClick: (query: string, field: SSHSearchField) => void
	onSuggestionClick: (suggestion: SearchSuggestion) => void
}) {
	// With nothing to show yet, the empty state would claim there are no keys while the search
	// is still running. Placeholders say "working on it" instead.
	if (isSearching && keys.length === 0) {
		return <SearchSkeleton count={Math.min(SKELETON_CARDS, resultsPerPage)} />
	}

	if (keys.length === 0) {
		return <EmptyResults hasSearchQuery={hasSearchQuery} keyType={keyType} onSuggestionClick={onSuggestionClick} />
	}

	// Previous results stay on screen while the next search runs, so fade them to make clear
	// they are not the answer to the query being typed.
	return (
		<div
			aria-busy={isSearching}
			className={cn(
				"mt-8 space-y-4 transition-opacity duration-200",
				isSearching && "pointer-events-none opacity-50",
			)}>
			{keys.map((key) =>
				keyType === "ssh" ? (
					<SSHKeyCard key={key.id} onSearchClick={onSearchClick} sshKey={key as SSHKey} />
				) : (
					<GPGKeyCard gpgKey={key as GPGKey} key={key.id} />
				),
			)}
		</div>
	)
}

export default function Explore({
	keyType,
	query,
	searchQuery,
	selectedFields,
	isAdvancedSearch,
	resultsPerPage,
	currentPage,
	onKeyTypeChange,
	onQueryChange,
	onSelectedFieldsChange,
	onAdvancedSearchChange,
	onResultsPerPageChange,
	onPageChange,
	onSearch,
}: ExploreProps) {
	const router = useRouter()

	// Landing on /explore with no term browses the whole index rather than showing an empty
	// page. The API orders every search by created_at descending, so that is newest first.
	const { data, isFetching, error } = useKeys({
		keyType,
		search: searchQuery,
		limit: resultsPerPage,
		offset: currentPage - 1,
		fields: !isAdvancedSearch && selectedFields.length > 0 ? selectedFields : undefined,
		advanced: isAdvancedSearch,
		browseAll: true,
	})

	const searchError = useMemo(() => {
		if (!error) {
			return undefined
		}
		if ("error" in error && error.error?.message) {
			return error.error.suggestion ? `${error.error.message} — ${error.error.suggestion}` : error.error.message
		}
		return "Something went wrong while searching. Please try again."
	}, [error])

	const keys = useMemo(() => {
		if (!data?.entities) {
			return []
		}
		return data.entities
	}, [data])

	const searchDuration = data?.duration
	const totalResults = data?.total || 0
	const totalPages = Math.ceil(totalResults / resultsPerPage)
	const startResult = (currentPage - 1) * resultsPerPage + 1
	const endResult = Math.min(currentPage * resultsPerPage, totalResults)

	const handleSearchClick = (searchQuery: string, field: SSHSearchField) => {
		router.push(`/explore/${searchQuery}?fields=${field}`)
	}

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		const urlParams = new URLSearchParams()

		if (suggestion.keyType && suggestion.keyType !== DEFAULT_KEY_TYPE) {
			urlParams.set("type", suggestion.keyType)
		}

		if (suggestion.isAdvanced) {
			urlParams.set("advanced", "true")
		} else if (suggestion.fields) {
			urlParams.set("fields", suggestion.fields.join(","))
		}

		const queryString = urlParams.toString()
		const url = queryString ? `/explore/${suggestion.query}?${queryString}` : `/explore/${suggestion.query}`

		router.push(url)
	}

	return (
		<div className="px-4 py-8">
			<KeySearch
				isAdvancedSearch={isAdvancedSearch}
				isSearching={isFetching}
				keyType={keyType}
				onAdvancedSearchChange={onAdvancedSearchChange}
				onKeyTypeChange={onKeyTypeChange}
				onQueryChange={onQueryChange}
				onResultsPerPageChange={onResultsPerPageChange}
				onSearch={onSearch}
				onSelectedFieldsChange={onSelectedFieldsChange}
				query={query}
				resultsPerPage={resultsPerPage}
				searchError={searchError}
				selectedFields={selectedFields}
			/>

			<ExploreResults
				hasSearchQuery={Boolean(searchQuery)}
				isSearching={isFetching}
				keys={keys}
				keyType={keyType}
				onSearchClick={handleSearchClick}
				onSuggestionClick={handleSuggestionClick}
				resultsPerPage={resultsPerPage}
			/>

			{totalResults > 0 && (
				<div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
					<p className="text-muted-foreground text-sm">
						Showing <span className="font-medium tabular-nums">{formatCount(startResult)}</span> to{" "}
						<span className="font-medium tabular-nums">{formatCount(endResult)}</span> of{" "}
						<span className="font-medium tabular-nums">{formatCount(totalResults)}</span> results
						{searchDuration !== undefined && (
							<>
								{" in "}
								<span className="font-medium tabular-nums">{formatDuration(searchDuration)}</span>
							</>
						)}
					</p>

					<div className="flex flex-wrap items-center justify-center gap-1">
						<Button
							aria-label="First page"
							className="h-8 w-8 bg-transparent"
							disabled={currentPage === 1}
							onClick={() => onPageChange(1)}
							size="icon"
							variant="outline">
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							aria-label="Previous page"
							className="h-8 w-8 bg-transparent"
							disabled={currentPage === 1}
							onClick={() => onPageChange(currentPage - 1)}
							size="icon"
							variant="outline">
							<ChevronLeft className="h-4 w-4" />
						</Button>

						<div className="flex items-center gap-1 px-2">
							{generatePageNumbers(currentPage, totalPages).map((page) =>
								typeof page === "string" ? (
									<span className="px-1 text-muted-foreground" key={page}>
										...
									</span>
								) : (
									<Button
										className="h-8 min-w-8 px-2 tabular-nums"
										key={page}
										onClick={() => onPageChange(page)}
										size="sm"
										variant={currentPage === page ? "default" : "outline"}>
										{formatCount(page)}
									</Button>
								),
							)}
						</div>

						<Button
							aria-label="Next page"
							className="h-8 w-8 bg-transparent"
							disabled={currentPage === totalPages}
							onClick={() => onPageChange(currentPage + 1)}
							size="icon"
							variant="outline">
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							aria-label="Last page"
							className="h-8 w-8 bg-transparent"
							disabled={currentPage === totalPages}
							onClick={() => onPageChange(totalPages)}
							size="icon"
							variant="outline">
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
