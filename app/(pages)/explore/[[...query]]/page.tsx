"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import Explore from "@/components/pages/explore"
import {
	DEFAULT_KEY_TYPE,
	DEFAULT_RESULTS_PER_PAGE,
	getDefaultFieldsForKeyType,
	getSearchFieldsForKeyType,
	type KeyType,
	RESULTS_PER_PAGE_OPTIONS,
	type ResultsPerPage,
	type SearchField,
} from "@/lib/key-search-config"
import { resolveSearchInput } from "@/lib/ssh-public-key"

function parseKeyType(typeParam: string | null): KeyType {
	if (typeParam === "ssh" || typeParam === "gpg") {
		return typeParam
	}
	return DEFAULT_KEY_TYPE
}

function parseFields(fieldsParam: string | null, keyType: KeyType): SearchField[] {
	const defaultFields = getDefaultFieldsForKeyType(keyType)
	const searchFields = getSearchFieldsForKeyType(keyType)

	if (!fieldsParam) {
		return defaultFields
	}
	const fields = fieldsParam.split(",").filter((f): f is SearchField => searchFields.some((sf) => sf.id === f))
	return fields.length > 0 ? fields : defaultFields
}

function parseResultsPerPage(limitParam: string | null): ResultsPerPage {
	if (!limitParam) {
		return DEFAULT_RESULTS_PER_PAGE
	}
	const parsed = Number(limitParam)
	if (RESULTS_PER_PAGE_OPTIONS.includes(parsed as ResultsPerPage)) {
		return parsed as ResultsPerPage
	}
	return DEFAULT_RESULTS_PER_PAGE
}

function parseAdvanced(advancedParam: string | null): boolean {
	return advancedParam === "true"
}

function parsePage(pageParam: string | null): number {
	if (!pageParam) {
		return 1
	}
	const parsed = Number(pageParam)
	return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
}

export default function ExplorePage() {
	const params = useParams<{ query?: string[] }>()
	const searchParams = useSearchParams()
	const router = useRouter()

	const urlQuery = useMemo(() => {
		if (!params.query || params.query.length === 0) {
			return ""
		}
		return decodeURIComponent(params.query.join("/"))
	}, [params.query])

	const [localKeyType, setLocalKeyType] = useState<KeyType>(() => parseKeyType(searchParams.get("type")))
	const [localQuery, setLocalQuery] = useState(urlQuery)
	const [localFields, setLocalFields] = useState<SearchField[]>(() =>
		parseFields(searchParams.get("fields"), localKeyType),
	)
	const [localAdvanced, setLocalAdvanced] = useState(() => parseAdvanced(searchParams.get("advanced")))
	const [localResultsPerPage, setLocalResultsPerPage] = useState<ResultsPerPage>(() =>
		parseResultsPerPage(searchParams.get("limit")),
	)

	const currentPage = useMemo(() => parsePage(searchParams.get("page")), [searchParams])

	useEffect(() => {
		setLocalQuery(urlQuery)
	}, [urlQuery])

	useEffect(() => {
		const newKeyType = parseKeyType(searchParams.get("type"))
		setLocalKeyType(newKeyType)
		setLocalAdvanced(parseAdvanced(searchParams.get("advanced")))
		setLocalFields(parseFields(searchParams.get("fields"), newKeyType))
		setLocalResultsPerPage(parseResultsPerPage(searchParams.get("limit")))
	}, [searchParams])

	const updateUrl = useCallback(
		(
			newKeyType: KeyType,
			newQuery: string,
			newFields: SearchField[],
			newAdvanced: boolean,
			newLimit: ResultsPerPage,
			page = 1,
		) => {
			const urlParams = new URLSearchParams()

			if (newKeyType !== DEFAULT_KEY_TYPE) {
				urlParams.set("type", newKeyType)
			}

			const defaultFields = getDefaultFieldsForKeyType(newKeyType)
			const fieldsChanged = JSON.stringify([...newFields].sort()) !== JSON.stringify([...defaultFields].sort())
			if (fieldsChanged) {
				urlParams.set("fields", newFields.join(","))
			}

			if (newAdvanced) {
				urlParams.set("advanced", "true")
			}

			if (newLimit !== DEFAULT_RESULTS_PER_PAGE) {
				urlParams.set("limit", String(newLimit))
			}

			if (page > 1) {
				urlParams.set("page", String(page))
			}

			const queryString = urlParams.toString()
			const path = newQuery ? `/explore/${newQuery}` : "/explore"
			const url = queryString ? `${path}?${queryString}` : path

			router.push(url)
		},
		[router],
	)

	const handleSearch = useCallback(async () => {
		// A pasted public key is resolved to a fingerprint lookup before it hits the URL (SSH only).
		const resolved =
			localKeyType === "ssh"
				? await resolveSearchInput(localQuery, localAdvanced)
				: { query: localQuery, isAdvanced: localAdvanced }

		if (resolved.fingerprint) {
			setLocalQuery(resolved.query)
			setLocalAdvanced(true)
		}

		updateUrl(localKeyType, resolved.query, localFields, resolved.isAdvanced, localResultsPerPage, 1)
	}, [localKeyType, localQuery, localFields, localAdvanced, localResultsPerPage, updateUrl])

	const handlePageChange = useCallback(
		(page: number) => {
			updateUrl(localKeyType, localQuery, localFields, localAdvanced, localResultsPerPage, page)
		},
		[localKeyType, localQuery, localFields, localAdvanced, localResultsPerPage, updateUrl],
	)

	const handleKeyTypeChange = useCallback(
		(newKeyType: KeyType) => {
			// Reset fields to defaults for the new key type
			const newDefaultFields = getDefaultFieldsForKeyType(newKeyType)
			setLocalKeyType(newKeyType)
			setLocalFields(newDefaultFields)
			updateUrl(newKeyType, localQuery, newDefaultFields, localAdvanced, localResultsPerPage, 1)
		},
		[localQuery, localAdvanced, localResultsPerPage, updateUrl],
	)

	return (
		<Explore
			currentPage={currentPage}
			isAdvancedSearch={localAdvanced}
			keyType={localKeyType}
			onAdvancedSearchChange={setLocalAdvanced}
			onKeyTypeChange={handleKeyTypeChange}
			onPageChange={handlePageChange}
			onQueryChange={setLocalQuery}
			onResultsPerPageChange={setLocalResultsPerPage}
			onSearch={handleSearch}
			onSelectedFieldsChange={setLocalFields}
			query={localQuery}
			resultsPerPage={localResultsPerPage}
			searchQuery={urlQuery}
			selectedFields={localFields}
		/>
	)
}
