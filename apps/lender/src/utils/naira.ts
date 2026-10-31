/** Whole naira with thousands separators: 50000000.5 → "₦50,000,001". */
export const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG")}`;
