import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: { remotePatterns: [ { protocol: "https", hostname: "loremflickr.com" }]},
    cacheComponents: true,
};

export default nextConfig;