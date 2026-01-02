import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from 'next'

const nextConfig = (): NextConfig => {
    const nextConfigOptions: NextConfig = {
        output: "standalone",
        reactStrictMode: true,
        poweredByHeader: false,
    }


    if (process.env.NODE_ENV != "production") {
        console.log('happy development session ;)')

        nextConfigOptions.rewrites = async () => [
            {
                source: "/api/:path*",
                destination: `${process.env.API_URL || "http://localhost:8080"}/api/:path*`,
            },
        ]
    }

    return nextConfigOptions
}

const withMDX = createMDX({
    // customise the config file path
    // configPath: "source.config.ts"
})

export default withMDX(nextConfig())
