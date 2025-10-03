/**
 * Next.js configuration
 *
 * The application is configured to leverage the App Router introduced in Next.js 13+. No
 * experimental features are enabled beyond the stable defaults. Should you need to
 * expose additional environment variables to the browser (for example, your Supabase
 * project URL) you can declare them in the `env` field below.
 */
// @ts-check

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;