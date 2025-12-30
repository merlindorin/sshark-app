import React from "react"
import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import ThemeProvider from "@/components/providers/ThemeProvider"
import QueryProvider from "@/components/providers/QueryProvider"
import {GoogleTagManager} from '@next/third-parties/google'
import "./globals.css"

const _geist = Geist({subsets: ["latin"]})
const _geistMono = Geist_Mono({subsets: ["latin"]})

const env = process.env.NODE_ENV

export const metadata: Metadata = {
    title: "sshark - Find Public SSH Keys",
    description: "Search for any user's public SSH keys instantly. Quick, secure, and developer-friendly.",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/icon-light-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/icon-dark-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/apple-icon.png",
    },
}


export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {

    return (
        <html lang="en" suppressHydrationWarning>
        {env === "production" && (<GoogleTagManager gtmId="GTM-5M5K2Q5R"/>)}
        <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
