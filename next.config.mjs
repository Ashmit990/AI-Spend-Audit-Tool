/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Security Headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: '/report/:id',
        destination: '/audit/:id',
        permanent: true,
      },
    ];
  },

  // ─── Performance ──────────────────────────────────────────────
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // ─── TypeScript & ESLint ──────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
