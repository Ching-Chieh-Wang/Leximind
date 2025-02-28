/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "leximind-profile-picture.us-003.s3.synologyc2.net",         // S3 Synology C2 bucket
    ],
  },
};

export default nextConfig;