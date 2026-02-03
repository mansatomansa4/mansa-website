/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',
  
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Required for static export - disables image optimization
    unoptimized: true,
  },
  // Disable server-side features for static export
  trailingSlash: true,
  
  // Skip dynamic routes during build - they'll work client-side
  skipTrailingSlashRedirect: true,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig