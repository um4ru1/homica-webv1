/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Konfigurasi gambar untuk Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'moloznuvdtfehxsufsxm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Konfigurasi Webpack yang sudah ada
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{
        loader: '@svgr/webpack',
        options: { icon: true }
      }]
    });
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
    return config;
  }
}

module.exports = nextConfig;