import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
  /**
   * Development only. Each service runs on its own host, so their cookies
   * would be third-party — never sent from this origin, and invisible to
   * middleware. Proxying them under /api makes them first-party instead, and
   * the access service's session cookie then reaches the lender service too.
   *
   * In production the APIs are served under the app's own domain, so there is
   * nothing to proxy and the NEXT_PUBLIC_*_API_URL values point at them directly.
   */
  async rewrites() {
    const accessOrigin = process.env.TRADE_NETWORK_API_ORIGIN;
    const lenderOrigin = process.env.TRADE_NETWORK_LENDER_API_ORIGIN;

    if (process.env.NODE_ENV === "production") return [];

    return [
      // First: the catch-all below would otherwise claim /api/lender as well.
      ...(lenderOrigin
        ? [
            {
              source: "/api/lender/:path*",
              destination: `${lenderOrigin}/api/v1/:path*`,
            },
          ]
        : []),
      ...(accessOrigin
        ? [{ source: "/api/:path*", destination: `${accessOrigin}/api/:path*` }]
        : []),
    ];
  },
};

export default nextConfig;
