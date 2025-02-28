// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'us-003.s3.synologyc2.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,

  // Add this block
  future: {
    // Explicitly enable Webpack 5
    webpack5: true,
  },

  webpack(config) {
    // Fix for 'fs' module not found error
    config.resolve.fallback = {
      ...config.resolve.fallback, // Retain other fallback options
      fs: false,                 // Disable fs in frontend
    };

    return config;
  },
};

export default nextConfig;