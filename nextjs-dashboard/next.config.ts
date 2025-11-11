import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Configuración para desarrollo con APIs externas
  async rewrites() {
    return [
      {
        source: '/api/componente-a/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
      {
        source: '/api/componente-b/:path*',
        destination: 'http://localhost:8081/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;