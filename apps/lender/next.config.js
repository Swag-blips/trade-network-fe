import { fileURLToPath } from "node:url";

const apiOrigin = process.env.TRADE_NETWORK_API_ORIGIN?.replace(/\/+$/, "");

const standalone = process.env.VERCEL
  ? {}
  : {
      output: "standalone",
      outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
    };

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...standalone,
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
  async rewrites() {
    if (!apiOrigin) return [];
    return [{ source: "/api/:path*", destination: `${apiOrigin}/:path*` }];
  },
};

export default nextConfig;
