import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    allowCrossOrigin: true,
    reactStrictMode: true,
};

export default nextConfig;
