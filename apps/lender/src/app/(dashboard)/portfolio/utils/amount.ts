export { parseAmount as toAmount } from "@/utils/mandate-options";

export const withKobo = (value: number) =>
  value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
