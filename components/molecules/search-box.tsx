"use client"

import {Box} from "@/components/atoms/box"
import {P} from "@/components/atoms/text"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {useValidateQuery} from "@/hooks/use-validate-query"
import {cn} from "@/lib/utils";
import {AlertCircle, CheckCircle, LoaderCircleIcon, Search} from "lucide-react"
import type {ChangeEvent, ComponentProps, FormEvent} from "react"
import {useDebounce} from "use-debounce"

interface SearchBoxProps extends ComponentProps<"div"> {
    searchFn: (value: string) => void
    searchQuery: string
    setSearchQuery: (value: ((prevState: string) => string) | string) => void
}

export function SearchBox({className, searchFn, searchQuery, setSearchQuery}: SearchBoxProps) {
    const [debouncedSearch] = useDebounce(searchQuery, 350)
    const {data: isValid, error, isError, isFetching} = useValidateQuery(debouncedSearch)

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
        <div className={cn(className, "flex flex-col gap-2 md:flex-row")}>
            <form className="grow flex flex-row gap-2" onSubmit={onSubmit}>
                <div className="relative grow" >
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        className="h-14 border-border bg-card pr-12 pl-12 text-base"
                        name="searchquery"
                        onChange={onChange}
                        placeholder="Enter username..."
                        type="text"
                        value={searchQuery}
                    />
                    {showValidation && (
                        <Box className="absolute top-1/2 right-4 -translate-y-1/2">
                            {isFetching && <LoaderCircleIcon className="h-5 w-5 animate-spin text-secondary"/>}
                            {!isFetching && isValid && <CheckCircle className="h-5 w-5 text-green-500"/>}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {!isFetching && isError && (
                                            <AlertCircle className="h-5 w-5 cursor-help text-destructive"/>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isError && (
                                            <P>{error && "error" in error ? error.error?.details : error?.message}</P>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Box>
                    )}
                </div>
                <Button className="h-14 px-8 font-bold" disabled={!isValid} size="lg" type="submit">
                    Search
                </Button>
            </form>
        </div>
    )
}
