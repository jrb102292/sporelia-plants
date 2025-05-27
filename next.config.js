/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    domains: ['picsum.photos', 'firebasestorage.googleapis.com'],
  },
  // Enable ESLint during builds
  eslint: {
    dirs: ['app', 'components', 'lib'],
  },
  // TypeScript config
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
