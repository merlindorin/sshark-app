import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { GoogleTagManager } from "@next/third-parties/google"
import { Logo } from "components/ui/logo"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import { links } from "@/app/links"
import QueryProvider from "@/components/providers/query-provider"
import ThemeProvider from "@/components/providers/theme-provider"
import { Navbar } from "@/components/templates/navbar/navbar"
import { Toaster } from "@/components/ui/sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				{env === "production" && <GoogleTagManager gtmId="GTM-5M5K2Q5R" />}
				<body className={"min-h-screen font-sans antialiased"}>
					<RootProvider>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
							<QueryProvider>
								<main className="flex flex-1 flex-col [--fd-layout-width:1400px]">
									<header className="sticky top-0 z-40 h-14">
										<Navbar
											links={links}
											logoLink={{
												href: "/",
												label: "Welcome",
												children: <Logo />,
											}}
										/>
									</header>
									<div className="flex h-full w-full min-w-0 flex-col">
										<main className="border-t border-dashed">
											<div className="mx-auto h-full w-full max-w-350 border-dashed p-4 sm:p-8 min-[1800px]:max-w-384 min-[1400px]:border-x">
												{children}
											</div>
										</main>
									</div>
									<footer
										aria-label="SSHark website footer"
										className="flex w-full flex-col"
										itemScope
										itemType="https://schema.org/WPFooter"
										role="contentinfo">
										<div className="mx-auto w-full max-w-[1400px] border-t border-dashed px-4 py-12 sm:px-8 sm:py-16 min-[1800px]:max-w-[1536px] min-[1400px]:border-x">
											<div
												className="mb-10 flex flex-col items-center gap-4"
												itemScope
												itemType="https://schema.org/Organization">
												<a
													aria-label="Go to SSHark homepage - Search public SSH keys"
													href="/"
													itemProp="url">
													<div
														aria-label="SSHark - Search public SSH keys"
														className="flex items-center"
														itemScope
														itemType="https://schema.org/Brand"
														role="img">
														<Logo />
													</div>
													<meta content="SSHark" itemProp="name" />
												</a>
												<p
													className="max-w-md text-center text-base text-muted-foreground"
													itemProp="description">
													Search for any user's public SSH keys instantly. Find keys by
													username, reverse lookup key ownership, or filter by encryption
													type. Quick, secure, and developer-friendly.
												</p>
											</div>
										</div>
										<div className="w-full border-t border-dashed">
											<div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-5 border-dashed px-8 py-6 pb-24 text-center text-muted-foreground max-lg:flex-col min-[1800px]:max-w-[1536px] min-[1400px]:border-x">
												<p className="text-base">
													<span aria-label="Copyright 2026">© 2026</span>{" "}
													<a
														aria-label="Go to SSHark homepage"
														className="font-medium text-foreground transition-all hover:text-primary hover:underline"
														href="/"
														title="SSHark - Search Public SSH Keys">
														SSHark
													</a>{" "}
													<span aria-label="Disclaimer">• Free SSH key lookup, forever</span>
												</p>
												<p className="text-base">
													<span>Built by</span>{" "}
													<a
														aria-label="Visit Merlindorin's GitHub profile (opens in new tab)"
														className="font-medium text-foreground transition-all hover:text-primary hover:underline"
														href="https://github.com/merlindorin"
														rel="noopener noreferrer"
														target="_blank"
														title="Merlindorin - Software Engineer">
														Merlindorin
													</a>
												</p>
											</div>
										</div>
									</footer>
								</main>
								<Toaster position="top-center" richColors={true} />
							</QueryProvider>
						</ThemeProvider>
					</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
