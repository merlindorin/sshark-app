export const SEARCH_FIELDS = [
	{ id: "fingerprint", label: "Fingerprint" },
	{ id: "source.username", label: "Username" },
	{ id: "source.provider", label: "Provider" },
	{ id: "algorithm", label: "Algorithm" },
	{ id: "comment", label: "Comment" },
] as const

export const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const

export type SearchField = (typeof SEARCH_FIELDS)[number]["id"]
export type ResultsPerPage = (typeof RESULTS_PER_PAGE_OPTIONS)[number]

export const DEFAULT_FIELDS: SearchField[] = ["source.username", "source.provider"]
export const DEFAULT_RESULTS_PER_PAGE: ResultsPerPage = 25
