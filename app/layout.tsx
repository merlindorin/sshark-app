import "./globals.css"
import {links} from "@/app/links"
import QueryProvider from "@/components/providers/query-provider"
import ThemeProvider from "@/components/providers/theme-provider"
import {Navbar} from "@/components/templates/navbar/navbar"
import {Toaster} from "@/components/ui/sonner"

import {ClerkProvider} from "@clerk/nextjs"

import {GoogleTagManager} from "@next/third-parties/google"
import {Logo} from "components/atoms/logo"
import {RootProvider} from "fumadocs-ui/provider/next"
import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import type React from "react"

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

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
            {env === "production" && <GoogleTagManager gtmId="GTM-5M5K2Q5R"/>}
            <body className={"min-h-screen font-sans antialiased"}>
            <RootProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <QueryProvider>
                        <main className="flex flex-1 flex-col [--fd-layout-width:1400px]">
                            <header className="sticky h-14 top-0 z-40">
                                <Navbar
                                    links={links}
                                    logoLink={{
                                        href: "/",
                                        label: "Welcome",
                                        children: <Logo/>,
                                    }}
                                />
                            </header>
                            <div className="flex h-full w-full min-w-0 flex-col">
                                <main className="border-t border-dashed">
                                    <div
                                        className="mx-auto h-full w-full max-w-350 border-dashed min-[1400px]:border-x min-[1800px]:max-w-384 p-4 sm:p-8">
                                        {children}
                                    </div>
                                </main>
                            </div>
                            <footer className="flex w-full flex-col" role="contentinfo"
                                    aria-label="SSHark website footer" itemScope
                                    itemType="https://schema.org/WPFooter">
                                <div
                                    className="mx-auto w-full max-w-[1400px] border-t border-dashed px-4 py-12 min-[1400px]:border-x min-[1800px]:max-w-[1536px] sm:px-8 sm:py-16">
                                    <div className="flex flex-col items-center gap-4 mb-10" itemScope
                                         itemType="https://schema.org/Organization">
                                        <a
                                            aria-label="Go to SSHark homepage - Search public SSH keys"
                                            itemProp="url" href="/">
                                            <div className="flex items-center"
                                                 aria-label="SSHark - Search public SSH keys" role="img"
                                                 itemScope itemType="https://schema.org/Brand">

                                                <Logo/>
                                            </div>
                                            <meta itemProp="name" content="SSHark"/>
                                        </a>
                                        <p className="text-base text-muted-foreground text-center max-w-md"
                                           itemProp="description">Search for any user's public SSH keys instantly. Find keys by username, reverse lookup key ownership, or filter by encryption type. Quick, secure, and developer-friendly.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full border-t border-dashed">
                                    <div
                                        className="text-muted-foreground mx-auto flex w-full max-w-[1400px] items-center justify-between gap-5 border-dashed px-8 py-6 pb-24 text-center max-lg:flex-col min-[1400px]:border-x min-[1800px]:max-w-[1536px]">
                                        <p className="text-base"><span aria-label="Copyright 2026">© 2026</span> <a
                                            className="text-foreground font-medium hover:text-primary hover:underline transition-all"
                                            aria-label="Go to SSHark homepage"
                                            title="SSHark - Search Public SSH Keys" href="/">SSHark</a> <span
                                            aria-label="Disclaimer">• Free SSH key lookup, forever</span>
                                        </p><p className="text-base"><span>Built by</span> <a target="_blank"
                                                                                              rel="noopener noreferrer"
                                                                                              className="text-foreground font-medium hover:text-primary hover:underline transition-all"
                                                                                              aria-label="Visit Merlindorin's GitHub profile (opens in new tab)"
                                                                                              title="Merlindorin - Software Engineer"
                                                                                              href="https://github.com/merlindorin">Merlindorin
                                        </a></p></div>
                                </div>
                            </footer>
                        </main>
                        <Toaster position="top-center" richColors={true}/>
                    </QueryProvider>
                </ThemeProvider>
            </RootProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}
