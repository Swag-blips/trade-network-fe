/** Whole naira with thousands separators: 50000000.5 → "₦50,000,001". */
export const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG")}`;

const UNITS: [number, string][] = [
  [1e9, "B"],
  [1e6, "M"],
  [1e3, "k"],
];

export function compactAmount(value: number) {
  const unit = UNITS.find(([size]) => value >= size);
  if (!unit) return Math.round(value).toLocaleString("en-NG");
  return `${Number((value / unit[0]).toFixed(1))}${unit[1]}`;
}
