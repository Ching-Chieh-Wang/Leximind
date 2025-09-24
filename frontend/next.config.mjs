/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
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
      "lh3.googleusercontent.com"
    ],
  },
};

export default nextConfig;