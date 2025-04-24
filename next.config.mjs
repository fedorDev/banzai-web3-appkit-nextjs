/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APPKIT_API_KEY: process.env.APPKIT_API_KEY,    
  },
};

export default nextConfig;
