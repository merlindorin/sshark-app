"use client"

import { AlertCircle, CheckCircle, LoaderCircleIcon, Search } from "lucide-react"
import type { ChangeEvent, FormEvent } from "react"
import { useDebounce } from "use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useValidateQuery } from "@/hooks/use-validate-query"

interface SearchBoxProps {
	searchFn: (value: string) => void
	searchQuery: string
	setSearchQuery: (value: ((prevState: string) => string) | string) => void
}

export function SearchBox({ searchFn, searchQuery, setSearchQuery }: SearchBoxProps) {
	const [debouncedSearch] = useDebounce(searchQuery, 350)
	const { data: isValid, error, isError, isFetching } = useValidateQuery(debouncedSearch)

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		searchFn(formData.get("searchquery") as string)
	}

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		setSearchQuery(e.target.value)
	}

	const showValidation = searchQuery.length > 0

	return (
		<form onSubmit={onSubmit}>
			<div className="flex flex-col gap-2 md:flex-row">
				<div className="relative flex-1">
					<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-14 border-border bg-card pr-12 pl-12 text-base"
						name="searchquery"
						onChange={onChange}
						placeholder="Enter username..."
						type="text"
						value={searchQuery}
					/>
					{showValidation && (
						<div className="absolute top-1/2 right-4 -translate-y-1/2">
							{isFetching && <LoaderCircleIcon className="h-5 w-5 animate-spin text-secondary" />}
							{!isFetching && isValid && <CheckCircle className="h-5 w-5 text-green-500" />}
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										{!isFetching && isError && (
											<AlertCircle className="h-5 w-5 cursor-help text-destructive" />
										)}
									</TooltipTrigger>
									<TooltipContent>
										{isError && (
											<p>{error && "error" in error ? error.error?.details : error?.message}</p>
										)}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					)}
				</div>
				<Button className="h-14 px-8" disabled={!isValid} size="lg" type="submit">
					Search
				</Button>
			</div>
		</form>
	)
}
