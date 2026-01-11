import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { GoogleTagManager } from "@next/third-parties/google"
import { Logo } from "components/atoms/logo"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import { links } from "@/app/links"
import QueryProvider from "@/components/providers/query-provider"
import ThemeProvider from "@/components/providers/theme-provider"
import { Footer } from "@/components/templates/footer"
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
				<body className={"flex min-h-screen flex-col font-sans antialiased"}>
					<RootProvider>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
							<QueryProvider>
								<div className="flex min-h-screen flex-col bg-background">
									<header className="border-border border-b">
										<Navbar
											links={links}
											logoLink={{
												href: "/",
												label: "Welcome",
												children: <Logo />,
											}}
										/>
									</header>
									{children}
									<Footer />
								</div>
								<Toaster position="top-center" richColors={true} />
							</QueryProvider>
						</ThemeProvider>
					</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
