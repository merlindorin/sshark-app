"use client"

import type {FormEvent} from "react"
import React, {ChangeEvent} from "react"
import {Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export default function SearchBox({searchQuery, setSearchQuery}: {
    searchQuery: string,
    setSearchQuery: (value: string) => void
}) {
    function onSubmit(e: FormEvent) {
        e.preventDefault()
        setSearchQuery(searchQuery)
    }

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        setSearchQuery(e.target.value)
    }

    return (
        <form onSubmit={onSubmit} className="w-full">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="text"
                        placeholder={`Try "merlindorin", "AAAAC3NzaC1lZDI1*"...`}
                        value={searchQuery}
                        onChange={onChange}
                        className="h-14 pl-12 pr-4 text-base bg-card border-border"
                    />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 cursor-pointer">
                    Search
                </Button>
            </div>
        </form>
    )
}
