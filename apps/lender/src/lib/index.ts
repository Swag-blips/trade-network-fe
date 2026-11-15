export const AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_TRADE_NETWORK_API_URL || "/api/v1",
  features: {
    verifyBusiness: process.env.NEXT_PUBLIC_FEATURE_VERIFY_BUSINESS === "true",
  },
};
