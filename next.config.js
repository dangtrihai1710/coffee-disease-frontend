/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép load images từ domain khác
    domains: [
      'localhost',
      '127.0.0.1'
    ],
    // Cho phép load images từ protocol khác
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5134', // Port HTTP từ launchSettings.json
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7179', // Port HTTPS từ launchSettings.json
        pathname: '/uploads/**',
      }
    ],
  },

  // Cấu hình proxy để redirect /uploads/* tới backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7179/api/:path*', // HTTPS Backend URL
      },
      {
        source: '/uploads/:path*',
        destination: 'https://localhost:7179/uploads/:path*', // Static files từ backend
      }
    ];
  },

  // CORS headers nếu cần
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;