import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "loremflickr.com",
                pathname: "/800/600/**",
            },
        ],
        qualities: [50, 75, 90],
        formats: ["image/avif", "image/webp"],
    },
    cacheComponents: true,
};

export default nextConfig;