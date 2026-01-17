"use client"

import { Search } from "lucide-react"
import type { ChangeEvent, ComponentProps, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBoxProps extends ComponentProps<"div"> {
	searchFn: (value: string) => void
	searchQuery: string
	setSearchQuery: (value: ((prevState: string) => string) | string) => void
}

export function SearchBox({ className, searchFn, searchQuery, setSearchQuery }: SearchBoxProps) {
	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const query = (formData.get("searchquery") as string).trim()
		if (query) {
			searchFn(query)
		}
	}

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		setSearchQuery(e.target.value)
	}

	return (
		<div className={cn(className, "flex flex-col gap-2 md:flex-row")}>
			<form className="flex grow flex-row gap-2" onSubmit={onSubmit}>
				<div className="relative grow">
					<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-14 border-border bg-card pl-12 text-base"
						name="searchquery"
						onChange={onChange}
						placeholder="Enter username..."
						type="text"
						value={searchQuery}
					/>
				</div>
				<Button className="h-14 px-8 font-bold" size="lg" type="submit">
					Search
				</Button>
			</form>
		</div>
	)
}
