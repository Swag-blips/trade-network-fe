/** Server and client stringify float tails differently; round coordinates drawn during render. */
export const round = (value: number) => Math.round(value * 1000) / 1000;
