import withPWAInit from 'next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: blob: https://api.dicebear.com https://images.unsplash.com https://www.google.com;
      connect-src 'self' https://*.supabase.co https://tinyurl.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.google.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withAnalyze(withPWA(nextConfig));
