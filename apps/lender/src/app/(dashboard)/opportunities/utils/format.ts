const UNITS: [number, string][] = [
  [1e9, "B"],
  [1e6, "M"],
  [1e3, "k"],
];

export const fullNaira = (value: number) =>
  `NGN ${Math.round(value).toLocaleString("en-NG")}`;

/** 50000 → "NGN 50k", 2500000 → "NGN 2.5M". */
export function compactNaira(value: number) {
  const unit = UNITS.find(([size]) => value >= size);
  if (!unit) return fullNaira(value);
  return `NGN ${Number((value / unit[0]).toFixed(1))}${unit[1]}`;
}
