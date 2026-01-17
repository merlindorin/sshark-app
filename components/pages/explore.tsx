"use client"

import { SSHKeyResults } from "@/components/ssh-key-results"
import { type ResultsPerPage, type SearchField, SSHKeySearch } from "@/components/ssh-key-search"

interface ExploreProps {
	query: string
	selectedFields: SearchField[]
	isAdvancedSearch: boolean
	resultsPerPage: ResultsPerPage
	onQueryChange: (query: string) => void
	onSelectedFieldsChange: (fields: SearchField[]) => void
	onAdvancedSearchChange: (isAdvanced: boolean) => void
	onResultsPerPageChange: (resultsPerPage: ResultsPerPage) => void
	onSearch: () => void
}

export default function Explore({
	query,
	selectedFields,
	isAdvancedSearch,
	resultsPerPage,
	onQueryChange,
	onSelectedFieldsChange,
	onAdvancedSearchChange,
	onResultsPerPageChange,
	onSearch,
}: ExploreProps) {
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
			<div className="mt-8">
				<SSHKeyResults
					currentPage={1}
					onPageChange={() => undefined}
					results={[]}
					resultsPerPage={resultsPerPage}
					totalResults={123}
				/>
			</div>
		</div>
	)
}
