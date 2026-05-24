/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  images: {
    remotePatterns: [{ protocol: "http", hostname: "**" }, { protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
