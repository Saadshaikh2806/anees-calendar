/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  optimizeFonts: false, // You can try setting this to false
}

module.exports = nextConfig
