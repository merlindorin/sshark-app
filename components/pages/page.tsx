import React, { PropsWithChildren } from "react"

export function Page({children}: React.PropsWithChildren) {
    return (
        <main className="container grow max-w-3xl flex flex-col mx-auto space-y-8 mt-12 px-6 py-12">
            {children}
        </main>
    )
}

export function PageHeader({title, description}: { title: string, description?: string }) {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="pt-2 text-xl text-muted-foreground">
                    {description}
                </p>
            </div>
            <div className="border-b border-dotted border-foreground/50"></div>
        </div>
    )
}

export function PageContent({children}: PropsWithChildren) {
    return (
        <div className="flex flex-col gap-8">
            {children}
        </div>
    )
}