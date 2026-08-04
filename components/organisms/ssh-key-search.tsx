"use client"

import { AlertCircle, ChevronDown, Fingerprint, LoaderCircle, Search, Settings2 } from "lucide-react"
import type React from "react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
	DEFAULT_RESULTS_PER_PAGE,
	RESULTS_PER_PAGE_OPTIONS,
	type ResultsPerPage,
	SEARCH_FIELDS,
	type SearchField,
} from "@/lib/ssh-key-search-config"
import { parsePublicKey } from "@/lib/ssh-public-key"
import { cn } from "@/lib/utils"

interface SSHKeySearchProps {
	query: string
	selectedFields: SearchField[]
	isAdvancedSearch: boolean
	resultsPerPage: ResultsPerPage
	/** A search is in flight. Results already on screen are the previous ones until it lands. */
	isSearching?: boolean
	searchError?: string
	onQueryChange: (query: string) => void
	onSelectedFieldsChange: (fields: SearchField[]) => void
	onAdvancedSearchChange: (isAdvanced: boolean) => void
	onResultsPerPageChange: (resultsPerPage: ResultsPerPage) => void
	onSearch?: () => void
	className?: string
}

export function SSHKeySearch({
	query,
	selectedFields,
	isAdvancedSearch,
	resultsPerPage,
	isSearching = false,
	searchError,
	onQueryChange,
	onSelectedFieldsChange,
	onAdvancedSearchChange,
	onResultsPerPageChange,
	onSearch,
	className,
}: SSHKeySearchProps) {
	const pastedKey = useMemo(() => parsePublicKey(query), [query])

	const handleFieldToggle = (field: SearchField) => {
		const newFields = selectedFields.includes(field)
			? selectedFields.filter((f) => f !== field)
			: [...selectedFields, field]
		onSelectedFieldsChange(newFields)
	}

	const handleSearch = () => {
		onSearch?.()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch()
		}
	}

	const selectedFieldsLabel =
		selectedFields.length === SEARCH_FIELDS.length
			? "All fields"
			: selectedFields.length === 0
				? "No fields"
				: selectedFields.length === 1
					? SEARCH_FIELDS.find((f) => f.id === selectedFields[0])?.label
					: `${selectedFields.length} fields`

	return (
		<div className={cn("w-full", className)}>
			<div className="flex items-center gap-2 rounded-lg border border-input bg-background p-1.5">
				{!isAdvancedSearch && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="shrink-0 gap-1.5 px-3 text-muted-foreground hover:text-foreground"
								size="sm"
								variant="ghost">
								<span className="text-sm">{selectedFieldsLabel}</span>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							{SEARCH_FIELDS.map((field) => (
								<DropdownMenuCheckboxItem
									checked={selectedFields.includes(field.id)}
									key={field.id}
									onCheckedChange={() => handleFieldToggle(field.id)}>
									{field.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				<div className="relative flex-1">
					{isSearching ? (
						<LoaderCircle className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
					) : (
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					)}
					<Input
						className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
						onChange={(e) => onQueryChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={
							isAdvancedSearch
								? "Enter advanced search query..."
								: "Search SSH keys or paste a public key..."
						}
						type="text"
						value={query}
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="shrink-0 gap-1.5 px-3 text-muted-foreground hover:text-foreground"
							size="sm"
							variant="ghost">
							<span className="text-sm">{resultsPerPage} / page</span>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-32">
						<DropdownMenuLabel>Results per page</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							onValueChange={(value) => onResultsPerPageChange(Number(value) as ResultsPerPage)}
							value={String(resultsPerPage)}>
							{RESULTS_PER_PAGE_OPTIONS.map((option) => (
								<DropdownMenuRadioItem key={option} value={String(option)}>
									{option}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="flex shrink-0 items-center gap-2 border-border border-l pr-1 pl-3">
					<Settings2 className="h-4 w-4 text-muted-foreground" />
					<Label className="cursor-pointer text-muted-foreground text-sm" htmlFor="advanced-search">
						Advanced
					</Label>
					<Switch checked={isAdvancedSearch} id="advanced-search" onCheckedChange={onAdvancedSearchChange} />
				</div>

				<Button className="shrink-0" disabled={isSearching} onClick={handleSearch} size="sm">
					{isSearching && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
					{isSearching ? "Searching..." : "Search"}
				</Button>
			</div>

			<output aria-live="polite" className="sr-only">
				{isSearching ? `Searching for ${query}` : ""}
			</output>

			{searchError && (
				<p className="mt-2 flex items-center gap-1.5 text-destructive text-sm">
					<AlertCircle className="h-4 w-4 shrink-0" />
					<span>{searchError}</span>
				</p>
			)}

			{pastedKey && (
				<p className="mt-2 flex items-center gap-1.5 text-muted-foreground text-sm">
					<Fingerprint className="h-4 w-4 shrink-0 text-primary" />
					<span>
						<span className="font-medium text-foreground">{pastedKey.algorithm}</span> public key detected —
						searching by fingerprint
					</span>
				</p>
			)}
		</div>
	)
}

export { DEFAULT_RESULTS_PER_PAGE, RESULTS_PER_PAGE_OPTIONS, SEARCH_FIELDS, type ResultsPerPage, type SearchField }
