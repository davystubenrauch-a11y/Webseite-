/** Brand facts used across the page. Replace placeholders before launch. */
export const site = {
  name: "SPIRULI",
  pzn: "11110571",
  /** Placeholder contact address. */
  email: "info@spiruli.de",
};

/**
 * PZN-8 check digit: weighted sum of the first seven digits (weights 1–7),
 * modulo 11. Returns true when the eighth digit matches.
 */
export function isValidPzn(pzn: string) {
  if (!/^\d{8}$/.test(pzn)) return false;
  const sum = [...pzn.slice(0, 7)].reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 11 === Number(pzn[7]);
}

