/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suprime warnings de hydration causados por extensões
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Suprime avisos específicos no console
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig