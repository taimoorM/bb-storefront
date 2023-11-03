/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/storefront/:path*",
        destination: "http://localhost:3000/api/storefront/:path*",
      },
    ];
  },
  images: {
    domains: ["sverkcrqoqcsoweuifdn.supabase.co", "localhost"],
  },
};

module.exports = nextConfig;
