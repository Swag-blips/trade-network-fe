import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
  /**
   * Development only. The access service runs on its own host locally, so its
   * cookies would be third-party — never sent from this origin, and invisible
   * to middleware. Proxying it under /api makes them first-party instead.
   *
   * In production the API is served under the app's own domain, so there is
   * nothing to proxy and NEXT_PUBLIC_TRADE_NETWORK_API_URL points at it directly.
   */
  async rewrites() {
    const origin = process.env.TRADE_NETWORK_API_ORIGIN;

    if (process.env.NODE_ENV === "production" || !origin) return [];

    return [{ source: "/api/:path*", destination: `${origin}/api/:path*` }];
  },
};

export default nextConfig;
