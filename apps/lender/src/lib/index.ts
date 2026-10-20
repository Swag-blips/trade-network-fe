export const AppConfig = {
  // Same-origin by default: proxied by next.config.js in dev, served under
  // the app's own domain in production. Endpoint paths are relative to it.
  apiUrl: process.env.NEXT_PUBLIC_TRADE_NETWORK_API_URL || "/api/v1",
};
