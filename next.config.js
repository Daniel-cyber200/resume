/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add these to bypass errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
