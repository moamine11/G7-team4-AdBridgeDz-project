/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Ignore TypeScript Errors (Type mismatches)
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Ignore ESLint Errors (Code style issues)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. Optimize images for static export/simple hosting
  images: {
    unoptimized: true,
  },
  // 4. Give more time for pages to generate before timing out
  staticPageGenerationTimeout: 100,
};

export default nextConfig;