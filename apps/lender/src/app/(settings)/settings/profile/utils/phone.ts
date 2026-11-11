import { parsePhoneNumberFromString } from "libphonenumber-js";

export const DIAL_CODES = ["+234"];

/** "+2348012345678" → `{ dialCode: "+234", number: "8012345678" }`. */
export function splitPhone(phone: string | null) {
  const parsed = phone ? parsePhoneNumberFromString(phone) : undefined;
  return parsed
    ? {
        dialCode: `+${parsed.countryCallingCode}`,
        number: String(parsed.nationalNumber),
      }
    : { dialCode: DIAL_CODES[0]!, number: "" };
}

/** The API normalises spaces and a leading 0; an empty number removes the phone. */
export function joinPhone(dialCode: string, number: string) {
  const trimmed = number.trim();
  return trimmed ? `${dialCode}${trimmed}` : null;
}
