/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'adnteftmqytcnieqmlma.supabase.co',
      },
    ],
    domains: [],
    // Don't use loader for local images
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

// Sentry configuration
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "mansa",
    project: "mansa-mentorship",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Webpack-specific options (moved from deprecated top-level options)
    webpack: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      treeshake: {
        removeDebugLogging: true,
      },
      // Enables automatic instrumentation of Vercel Cron Monitors.
      automaticVercelMonitors: true,
    },
  }
);