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
import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ResultsPerPage, SearchField } from "./ssh-key-search"

export interface SSHKey {
	id: string
	key: string
	username: string
	provider: string
	type: string
	createdAt: string
}

interface SearchSuggestion {
	label: string
	query: string
	fields?: SearchField[]
	isAdvanced?: boolean
	icon: React.ReactNode
}

interface SSHKeyResultsProps {
	results: SSHKey[]
	totalResults: number
	currentPage: number
	resultsPerPage: ResultsPerPage
	onPageChange: (page: number) => void
	onSuggestionClick?: (suggestion: SearchSuggestion) => void
	isLoading?: boolean
	className?: string
}

const searchSuggestions: SearchSuggestion[] = [
	{
		label: "GitHub keys",
		query: "github",
		fields: ["provider"],
		icon: <Github className="h-5 w-5" />,
	},
	{
		label: "GitLab keys",
		query: "gitlab",
		fields: ["provider"],
		icon: <Server className="h-5 w-5" />,
	},
	{
		label: "RSA keys",
		query: "rsa",
		fields: ["type"],
		icon: <Shield className="h-5 w-5" />,
	},
	{
		label: "ED25519 keys",
		query: "ed25519",
		fields: ["type"],
		icon: <Key className="h-5 w-5" />,
	},
	{
		label: "Search by username",
		query: "",
		fields: ["username"],
		icon: <Search className="h-5 w-5" />,
	},
	{
		label: "Advanced search",
		query: "type:rsa provider:github",
		isAdvanced: true,
		icon: <Sparkles className="h-5 w-5" />,
	},
]

export function SSHKeyResults({
	results,
	totalResults,
	currentPage,
	resultsPerPage,
	onPageChange,
	onSuggestionClick,
	isLoading = false,
	className,
}: SSHKeyResultsProps) {
	const totalPages = Math.ceil(totalResults / resultsPerPage)
	const startResult = (currentPage - 1) * resultsPerPage + 1
	const endResult = Math.min(currentPage * resultsPerPage, totalResults)

	if (isLoading) {
		return (
			<div className={cn("rounded-lg border border-border", className)}>
				<div className="flex items-center justify-center p-12 text-muted-foreground">Loading results...</div>
			</div>
		)
	}

	if (results.length === 0) {
		return (
			<div className={cn("rounded-lg border border-border border-dashed", className)}>
				<div className="flex flex-col items-center gap-6 p-8 text-center">
					<div className="flex flex-col items-center gap-2">
						<Key className="h-10 w-10 text-muted-foreground" />
						<p className="font-medium text-foreground text-lg">No SSH keys found</p>
						<p className="text-muted-foreground text-sm">Try one of these search suggestions</p>
					</div>

					<div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
						{searchSuggestions.map((suggestion) => (
							<button
								className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-4 text-center transition-colors hover:border-primary hover:bg-muted/50"
								key={suggestion.label}
								onClick={() => onSuggestionClick?.(suggestion)}>
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

	return (
		<div className={cn("space-y-4", className)}>
			{/* Results list */}
			<div className="rounded-lg border border-border">
				<div className="divide-y divide-border">
					{results.map((sshKey) => (
						<div className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/50" key={sshKey.id}>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
								<Key className="h-5 w-5 text-muted-foreground" />
							</div>
							<div className="min-w-0 flex-1 space-y-1">
								<div className="flex items-center gap-2">
									<span className="font-medium text-foreground">{sshKey.username}</span>
									<span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
										{sshKey.type}
									</span>
									<span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
										{sshKey.provider}
									</span>
								</div>
								<p className="truncate font-mono text-muted-foreground text-sm">{sshKey.key}</p>
								<p className="text-muted-foreground text-xs">Created: {sshKey.createdAt}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
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
								<span className="px-1 text-muted-foreground" key={`ellipsis-${index}`}>
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
		</div>
	)
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
