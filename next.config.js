/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/storefront/:path*",
        destination: "http://localhost:3001/api/storefront/:path*",
      },
    ];
  },
  images: {
    domains: ["sverkcrqoqcsoweuifdn.supabase.co"],
  },
};

module.exports = nextConfig;
