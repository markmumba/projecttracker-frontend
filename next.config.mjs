/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/projecttracker-3e7f5.appspot.com/**',
      },
    ],
  }, 
};
export default nextConfig;
