/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during the build process
  },
}

module.exports = nextConfig
