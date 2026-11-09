/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
};

export default nextConfig;
