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
import { SSHKeyCard } from "@/components/organisms/ssh-key-card"
import { SSHKeySearch, type ResultsPerPage, type SearchField } from "@/components/organisms/ssh-key-search"
import { Button } from "@/components/ui/button"
import { useSshKeys } from "@/hooks/use-ssh-keys"

interface ExploreProps {
	query: string
	searchQuery: string
	selectedFields: SearchField[]
	isAdvancedSearch: boolean
	resultsPerPage: ResultsPerPage
	currentPage: number
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
	fields?: SearchField[]
	isAdvanced?: boolean
	icon: React.ReactNode
}

const searchSuggestions: SearchSuggestion[] = [
	{
		label: "GitHub keys",
		query: "@provider:{github}",
		isAdvanced: true,
		icon: <Github className="h-5 w-5" />,
	},
	{
		label: "GitLab keys",
		query: "@provider:{gitlab}",
		isAdvanced: true,
		icon: <Server className="h-5 w-5" />,
	},
	{
		label: "RSA keys",
		query: "@type:{ssh-rsa}",
		isAdvanced: true,
		icon: <Shield className="h-5 w-5" />,
	},
	{
		label: "ED25519 keys",
		query: "@type:{ssh-ed25519}",
		isAdvanced: true,
		icon: <Key className="h-5 w-5" />,
	},
	{
		label: "Search by username",
		query: "merlin",
		fields: ["username"],
		icon: <Search className="h-5 w-5" />,
	},
	{
		label: "Advanced search",
		query: "@type:{ssh-rsa} @provider:{github}",
		isAdvanced: true,
		icon: <Sparkles className="h-5 w-5" />,
	},
]

function buildSearchQuery(query: string, selectedFields: SearchField[], isAdvanced: boolean): string {
	if (isAdvanced) {
		return query
	}

	if (!query.trim()) {
		return "*"
	}

	if (selectedFields.length === 0) {
		return query
	}

	const fieldQueries = selectedFields.map((field) => `@${field}:{${query}*}`)

	return fieldQueries.join(" | ")
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	if (current <= 3) {
		return [1, 2, 3, 4, 5, "...", total]
	}

	if (current >= total - 2) {
		return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
	}

	return [1, "...", current - 1, current, current + 1, "...", total]
}

export default function Explore({
	query,
	searchQuery,
	selectedFields,
	isAdvancedSearch,
	resultsPerPage,
	currentPage,
	onQueryChange,
	onSelectedFieldsChange,
	onAdvancedSearchChange,
	onResultsPerPageChange,
	onPageChange,
	onSearch,
}: ExploreProps) {
	const router = useRouter()

	const apiSearchQuery = useMemo(
		() => buildSearchQuery(searchQuery, selectedFields, isAdvancedSearch),
		[searchQuery, selectedFields, isAdvancedSearch],
	)

	const { data } = useSshKeys(apiSearchQuery, resultsPerPage, currentPage - 1)

	const sshKeys = useMemo(() => {
		if (!data?.entities) {
			return []
		}
		return data.entities.flat()
	}, [data])

	const totalResults = data?.total || 0
	const totalPages = Math.ceil(totalResults / resultsPerPage)
	const startResult = (currentPage - 1) * resultsPerPage + 1
	const endResult = Math.min(currentPage * resultsPerPage, totalResults)

	const handleSearchClick = (searchQuery: string) => {
		router.push(`/explore/${encodeURIComponent(searchQuery)}?advanced=true`)
	}

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		const urlParams = new URLSearchParams()

		if (suggestion.isAdvanced) {
			urlParams.set("advanced", "true")
		} else if (suggestion.fields) {
			urlParams.set("fields", suggestion.fields.join(","))
		}

		const queryString = urlParams.toString()
		const encodedQuery = encodeURIComponent(suggestion.query)
		const url = queryString ? `/explore/${encodedQuery}?${queryString}` : `/explore/${encodedQuery}`

		router.push(url)
	}

	return (
		<div>
			<SSHKeySearch
				isAdvancedSearch={isAdvancedSearch}
				onAdvancedSearchChange={onAdvancedSearchChange}
				onQueryChange={onQueryChange}
				onResultsPerPageChange={onResultsPerPageChange}
				onSearch={onSearch}
				onSelectedFieldsChange={onSelectedFieldsChange}
				query={query}
				resultsPerPage={resultsPerPage}
				selectedFields={selectedFields}
			/>

			{sshKeys.length === 0 ? (
				<div className="mt-8 rounded-lg border border-border border-dashed">
					<div className="flex flex-col items-center gap-6 p-8 text-center">
						<div className="flex flex-col items-center gap-2">
							<Key className="h-10 w-10 text-muted-foreground" />
							<p className="font-medium text-foreground text-lg">
								{searchQuery ? "No SSH keys found" : "Start searching for SSH keys"}
							</p>
							<p className="text-muted-foreground text-sm">Try one of these search suggestions</p>
						</div>

						<div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
							{searchSuggestions.map((suggestion) => (
								<button
									className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:border-primary hover:bg-muted/50"
									key={suggestion.label}
									onClick={() => handleSuggestionClick(suggestion)}
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
			) : (
				<div className="mt-8 space-y-4">
					{sshKeys.map((sshKey) => (
						<SSHKeyCard key={sshKey.id} onSearchClick={handleSearchClick} sshKey={sshKey} />
					))}
				</div>
			)}

			{/* Pagination */}
			{totalResults > 0 && (
				<div className="mt-4 flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Showing <span className="font-medium">{startResult}</span> to{" "}
						<span className="font-medium">{endResult}</span> of{" "}
						<span className="font-medium">{totalResults}</span> results
					</p>

					<div className="flex items-center gap-1">
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

						{/* Page numbers */}
						<div className="flex items-center gap-1 px-2">
							{generatePageNumbers(currentPage, totalPages).map((page, index) =>
								page === "..." ? (
									<span
										className="px-1 text-muted-foreground"
										key={`ellipsis-${currentPage}-${index}`}>
										...
									</span>
								) : (
									<Button
										className="h-8 w-8"
										key={page}
										onClick={() => onPageChange(page as number)}
										size="icon"
										variant={currentPage === page ? "default" : "outline"}>
										{page}
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
