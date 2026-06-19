/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.burgerking.it' },
      { protocol: 'https', hostname: '*.blob.core.windows.net' },
    ],
  },
  output: 'standalone',
};

export default nextConfig;