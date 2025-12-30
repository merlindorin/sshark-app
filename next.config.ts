import type {NextConfig} from "next";
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants'

const nextConfig = (phase: string) => {
    const nextConfigOptions: NextConfig = {
        output: "standalone",
        reactStrictMode: true,
        poweredByHeader: false,
    };

    if (phase === PHASE_DEVELOPMENT_SERVER) {
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

export default nextConfig;
