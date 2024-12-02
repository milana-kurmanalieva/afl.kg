/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');


const nextConfig = {
  reactStrictMode: false,
  env: { BASE_URL: process.env.BASE_URL },
  distDir: '_static',
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.HOST_NAME,
        port: '',
      }, { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};

module.exports = nextConfig;
