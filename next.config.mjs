/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: ["next-superjson-plugin", {}],
  },
  images: {
    domains: ["res.clundinary.com", "avatas.githubusercontent.com"],
  },
};

export default nextConfig;
