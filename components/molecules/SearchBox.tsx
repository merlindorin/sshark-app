"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useValidateQuery } from "@/hooks/use-validate-query"
import { AlertCircle, CheckCircle, LoaderCircleIcon, Search } from "lucide-react"
import React, { ChangeEvent, FormEvent } from "react"
import { useDebounce } from "use-debounce"

type SearchBoxProps = {
    searchFn: (value: string) => void,
    searchQuery: string,
    setSearchQuery: (value: (((prevState: string) => string) | string)) => void
}

export function SearchBox({searchFn, searchQuery, setSearchQuery}: SearchBoxProps) {
    const [debouncedSearch] = useDebounce(searchQuery, 350)
    const {data: isValid, error, isError, isFetching} = useValidateQuery(debouncedSearch)

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        searchFn(formData.get('searchquery') as string)
    }

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        setSearchQuery(e.target.value)
    }

    const showValidation = searchQuery.length > 0

    return (
        <form onSubmit={onSubmit} className="w-full">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        name="searchquery"
                        type="text"
                        placeholder="Enter username..."
                        onChange={onChange}
                        value={searchQuery}
                        className="h-14 pl-12 pr-12 text-base bg-card border-border"
                    />
                    {showValidation && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {(isFetching) && (
                                <LoaderCircleIcon className="h-5 w-5 animate-spin text-secondary"/>
                            )}
                            {!(isFetching) && isValid && (
                                <CheckCircle className="h-5 w-5 text-green-500"/>
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {!(isFetching) && isError && (
                                            <AlertCircle className="h-5 w-5 cursor-help text-destructive"/>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isError &&
                                            <p>{error && 'error' in error ? error.error?.details : error?.message}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </div>
                <Button type="submit" size="lg" className="h-14 px-8" disabled={!isValid}>
                    Search
                </Button>
            </div>
        </form>
    )
}
