export const KEY_TYPES = [
	{ id: "ssh", label: "SSH Keys" },
	{ id: "gpg", label: "GPG Keys" },
] as const

export type KeyType = (typeof KEY_TYPES)[number]["id"]

export const SSH_SEARCH_FIELDS = [
	{ id: "fingerprint", label: "Fingerprint" },
	{ id: "source.username", label: "Username" },
	{ id: "source.provider", label: "Provider" },
	{ id: "algorithm", label: "Algorithm" },
	{ id: "comment", label: "Comment" },
] as const

export const GPG_SEARCH_FIELDS = [
	{ id: "fingerprint", label: "Fingerprint" },
	{ id: "source.username", label: "Username" },
	{ id: "source.provider", label: "Provider" },
	{ id: "algorithm", label: "Algorithm" },
	{ id: "user_ids", label: "User IDs" },
	{ id: "capabilities", label: "Capabilities" },
] as const

export const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const

export type SSHSearchField = (typeof SSH_SEARCH_FIELDS)[number]["id"]
export type GPGSearchField = (typeof GPG_SEARCH_FIELDS)[number]["id"]
export type SearchField = SSHSearchField | GPGSearchField
export type ResultsPerPage = (typeof RESULTS_PER_PAGE_OPTIONS)[number]

export const DEFAULT_SSH_FIELDS: SSHSearchField[] = ["source.username", "source.provider"]
export const DEFAULT_GPG_FIELDS: GPGSearchField[] = ["source.username", "source.provider"]
export const DEFAULT_RESULTS_PER_PAGE: ResultsPerPage = 25
export const DEFAULT_KEY_TYPE: KeyType = "ssh"

export function getSearchFieldsForKeyType(keyType: KeyType) {
	return keyType === "ssh" ? SSH_SEARCH_FIELDS : GPG_SEARCH_FIELDS
}

export function getDefaultFieldsForKeyType(keyType: KeyType): SearchField[] {
	return keyType === "ssh" ? DEFAULT_SSH_FIELDS : DEFAULT_GPG_FIELDS
}
