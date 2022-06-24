/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://whattime.ru/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
