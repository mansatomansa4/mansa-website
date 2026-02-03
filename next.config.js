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
  
  // Prevents Next.js from auto-redirecting between /path and /path/ (based on trailingSlash setting)
  // Note: This does not affect dynamic route generation - dynamic routes (e.g., [id].tsx) 
  // must be handled via generateStaticParams or client-side fallback behavior
  skipTrailingSlashRedirect: true,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig