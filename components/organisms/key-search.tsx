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
	getSearchFieldsForKeyType,
	KEY_TYPES,
	type KeyType,
	RESULTS_PER_PAGE_OPTIONS,
	type ResultsPerPage,
	type SearchField,
} from "@/lib/key-search-config"
import { parsePublicKey } from "@/lib/ssh-public-key"
import { cn } from "@/lib/utils"

interface KeySearchProps {
	keyType: KeyType
	query: string
	selectedFields: SearchField[]
	isAdvancedSearch: boolean
	resultsPerPage: ResultsPerPage
	/** A search is in flight. Results already on screen are the previous ones until it lands. */
	isSearching?: boolean
	searchError?: string
	onKeyTypeChange: (keyType: KeyType) => void
	onQueryChange: (query: string) => void
	onSelectedFieldsChange: (fields: SearchField[]) => void
	onAdvancedSearchChange: (isAdvanced: boolean) => void
	onResultsPerPageChange: (resultsPerPage: ResultsPerPage) => void
	onSearch?: () => void
	className?: string
}

export function KeySearch({
	keyType,
	query,
	selectedFields,
	isAdvancedSearch,
	resultsPerPage,
	isSearching = false,
	searchError,
	onKeyTypeChange,
	onQueryChange,
	onSelectedFieldsChange,
	onAdvancedSearchChange,
	onResultsPerPageChange,
	onSearch,
	className,
}: KeySearchProps) {
	const pastedKey = useMemo(() => parsePublicKey(query), [query])
	const searchFields = getSearchFieldsForKeyType(keyType)

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

	const selectedFieldsLabel = (() => {
		if (selectedFields.length === searchFields.length) return "All fields"
		if (selectedFields.length === 0) return "No fields"
		if (selectedFields.length === 1) return searchFields.find((f) => f.id === selectedFields[0])?.label
		return `${selectedFields.length} fields`
	})()

	const searchPlaceholder = (() => {
		if (isAdvancedSearch) return "Enter advanced search query..."
		if (keyType === "ssh") return "Search SSH keys or paste a public key..."
		return "Search GPG keys..."
	})()

	return (
		<div className={cn("w-full space-y-3", className)}>
			<div className="flex items-center gap-2 rounded-lg border border-input bg-background p-1.5">
				<div className="flex shrink-0 items-center gap-0.5 rounded-md bg-muted p-0.5">
					{KEY_TYPES.map((type) => (
						<button
							className={cn(
								"rounded px-2.5 py-1 text-xs font-medium transition-colors",
								keyType === type.id
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground",
							)}
							key={type.id}
							onClick={() => onKeyTypeChange(type.id)}
							type="button">
							{type.label}
						</button>
					))}
				</div>

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
							{searchFields.map((field) => (
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
						placeholder={searchPlaceholder}
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

			{pastedKey && keyType === "ssh" && (
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

export { DEFAULT_RESULTS_PER_PAGE, RESULTS_PER_PAGE_OPTIONS, type ResultsPerPage, type SearchField }
