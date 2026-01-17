export const SEARCH_FIELDS = [
	{ id: "key", label: "Key" },
	{ id: "username", label: "Username" },
	{ id: "provider", label: "Provider" },
	{ id: "type", label: "Type" },
] as const

export const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const

export type SearchField = (typeof SEARCH_FIELDS)[number]["id"]
export type ResultsPerPage = (typeof RESULTS_PER_PAGE_OPTIONS)[number]

export const DEFAULT_FIELDS: SearchField[] = ["key", "username", "provider", "type"]
export const DEFAULT_RESULTS_PER_PAGE: ResultsPerPage = 25
