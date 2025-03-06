/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
         protocol: "https",
         hostname: "*.googleusercontent.com",
         port: "",
         pathname: "**",
      }
    ],
    domains: [
      "leximind-profile-picture.us-003.s3.synologyc2.net",         // S3 Synology C2 bucket
    ],
  },
};

export default nextConfig;