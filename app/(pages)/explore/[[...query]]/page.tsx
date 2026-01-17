"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import Explore from "@/components/pages/explore"
import {
	DEFAULT_FIELDS,
	DEFAULT_RESULTS_PER_PAGE,
	RESULTS_PER_PAGE_OPTIONS,
	type ResultsPerPage,
	SEARCH_FIELDS,
	type SearchField,
} from "@/components/ssh-key-search"

function parseFields(fieldsParam: string | null): SearchField[] {
	if (!fieldsParam) {
		return DEFAULT_FIELDS
	}
	const fields = fieldsParam.split(",").filter((f): f is SearchField => SEARCH_FIELDS.some((sf) => sf.id === f))
	return fields.length > 0 ? fields : DEFAULT_FIELDS
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

	const [localQuery, setLocalQuery] = useState(urlQuery)
	const [localFields, setLocalFields] = useState<SearchField[]>(() => parseFields(searchParams.get("fields")))
	const [localAdvanced, setLocalAdvanced] = useState(() => parseAdvanced(searchParams.get("advanced")))
	const [localResultsPerPage, setLocalResultsPerPage] = useState<ResultsPerPage>(() =>
		parseResultsPerPage(searchParams.get("limit")),
	)

	const updateUrl = useCallback(
		(newQuery: string, newFields: SearchField[], newAdvanced: boolean, newLimit: ResultsPerPage) => {
			const urlParams = new URLSearchParams()

			const fieldsChanged = JSON.stringify([...newFields].sort()) !== JSON.stringify([...DEFAULT_FIELDS].sort())
			if (fieldsChanged) {
				urlParams.set("fields", newFields.join(","))
			}

			if (newAdvanced) {
				urlParams.set("advanced", "true")
			}

			if (newLimit !== DEFAULT_RESULTS_PER_PAGE) {
				urlParams.set("limit", String(newLimit))
			}

			const queryString = urlParams.toString()
			const encodedQuery = newQuery ? encodeURIComponent(newQuery) : ""
			const path = encodedQuery ? `/explore/${encodedQuery}` : "/explore"
			const url = queryString ? `${path}?${queryString}` : path

			router.push(url)
		},
		[router],
	)

	const handleSearch = useCallback(() => {
		updateUrl(localQuery, localFields, localAdvanced, localResultsPerPage)
	}, [localQuery, localFields, localAdvanced, localResultsPerPage, updateUrl])

	return (
		<Explore
			isAdvancedSearch={localAdvanced}
			onAdvancedSearchChange={setLocalAdvanced}
			onQueryChange={setLocalQuery}
			onResultsPerPageChange={setLocalResultsPerPage}
			onSearch={handleSearch}
			onSelectedFieldsChange={setLocalFields}
			query={localQuery}
			resultsPerPage={localResultsPerPage}
			selectedFields={localFields}
		/>
	)
}
