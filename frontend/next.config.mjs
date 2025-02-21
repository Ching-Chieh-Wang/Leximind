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
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;