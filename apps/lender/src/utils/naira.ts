/** Whole naira with thousands separators, no symbol: 50000000.5 → "50,000,001". */
export const formatAmount = (value: number) =>
  Math.round(value).toLocaleString("en-NG");

/** Whole naira with the symbol: 50000000.5 → "₦50,000,001". */
export const naira = (value: number) => `₦${formatAmount(value)}`;

/** Naira with kobo: 250000000 → "250,000,000.00". */
export const withKobo = (value: number) =>
  value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const UNITS: [number, string][] = [
  [1e9, "B"],
  [1e6, "M"],
  [1e3, "k"],
];

export function compactAmount(value: number) {
  const unit = UNITS.find(([size]) => value >= size);
  if (!unit) return formatAmount(value);
  return `${Number((value / unit[0]).toFixed(1))}${unit[1]}`;
}

/** Digits only, for whole-naira fields and strings like "₦8,500,000". */
export const parseAmount = (value: string) =>
  Number(value.replace(/[^0-9]/g, ""));

/** What a typed amount field shows: grouped, at most two decimals, no leading zeros. */
export function formatAmountInput(value: string) {
  const [whole = "", ...fraction] = value.replace(/[^0-9.]/g, "").split(".");
  const grouped = whole
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction.length > 0
    ? `${grouped}.${fraction.join("").slice(0, 2)}`
    : grouped;
}

/** Reads `formatAmountInput`'s text back, keeping the decimals. */
export const parseAmountInput = (value: string) =>
  Number(value.replace(/,/g, ""));

// Naira has two decimal places; another currency would need its own multiplier.
export const toMinorUnits = (naira: number) => Math.round(naira * 100);
export const fromMinorUnits = (minor: number) => minor / 100;
