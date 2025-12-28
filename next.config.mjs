/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.openai.com', 'your-image-source.com'], // whitelist your sources
  },
  experimental: {
    turbo: true,             // faster dev builds
    serverActions: true      // if you use server actions
  },
  output: 'standalone',      // smaller Docker/server builds
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
};

export default nextConfig;
