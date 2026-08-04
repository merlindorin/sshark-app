import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig = (): NextConfig => {
	const nextConfigOptions: NextConfig = {
		output: "standalone",
		reactStrictMode: true,
		poweredByHeader: false,
	}

	// `/merlin.keys` and `/@merlin.gpg` are one path segment with an extension, which the App
	// Router cannot express as a folder: `[username].keys` registers as a literal path, never
	// matching a real username. Rewriting to a normal dynamic route is what makes them work.
	const keyFileRewrites = [
		{ source: "/:username.keys", destination: "/keys/:username" },
		{ source: "/:username.gpg", destination: "/gpg/:username" },
	]

	if (process.env.NODE_ENV === "production") {
		nextConfigOptions.rewrites = async () => keyFileRewrites
	} else {
		console.log("happy development session ;)")

		nextConfigOptions.rewrites = async () => [
			{
				source: "/api/:path*",
				destination: `${process.env.API_URL || "http://localhost:8080"}/api/:path*`,
			},
			...keyFileRewrites,
		]
	}

	return nextConfigOptions
}

const withMDX = createMDX({
	// customise the config file path
	// configPath: "source.config.ts"
})

export default withMDX(nextConfig())
