import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
};

export default nextConfig;
