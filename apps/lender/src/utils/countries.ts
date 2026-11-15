/** `value` is ISO 3166-1 alpha-2, which is what the service's `countryCode` expects. */
export const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "EG", label: "Egypt" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
];

export const hasState = (countryCode: string) => countryCode === "NG";

/** `value` is ISO 3166-2, which is what the service's `state` expects. */
export const NIGERIAN_STATES = [
  { value: "NG-AB", label: "Abia" },
  { value: "NG-AD", label: "Adamawa" },
  { value: "NG-AK", label: "Akwa Ibom" },
  { value: "NG-AN", label: "Anambra" },
  { value: "NG-BA", label: "Bauchi" },
  { value: "NG-BY", label: "Bayelsa" },
  { value: "NG-BE", label: "Benue" },
  { value: "NG-BO", label: "Borno" },
  { value: "NG-CR", label: "Cross River" },
  { value: "NG-DE", label: "Delta" },
  { value: "NG-EB", label: "Ebonyi" },
  { value: "NG-ED", label: "Edo" },
  { value: "NG-EK", label: "Ekiti" },
  { value: "NG-EN", label: "Enugu" },
  { value: "NG-FC", label: "FCT" },
  { value: "NG-GO", label: "Gombe" },
  { value: "NG-IM", label: "Imo" },
  { value: "NG-JI", label: "Jigawa" },
  { value: "NG-KD", label: "Kaduna" },
  { value: "NG-KN", label: "Kano" },
  { value: "NG-KT", label: "Katsina" },
  { value: "NG-KE", label: "Kebbi" },
  { value: "NG-KO", label: "Kogi" },
  { value: "NG-KW", label: "Kwara" },
  { value: "NG-LA", label: "Lagos" },
  { value: "NG-NA", label: "Nasarawa" },
  { value: "NG-NI", label: "Niger" },
  { value: "NG-OG", label: "Ogun" },
  { value: "NG-ON", label: "Ondo" },
  { value: "NG-OS", label: "Osun" },
  { value: "NG-OY", label: "Oyo" },
  { value: "NG-PL", label: "Plateau" },
  { value: "NG-RI", label: "Rivers" },
  { value: "NG-SO", label: "Sokoto" },
  { value: "NG-TA", label: "Taraba" },
  { value: "NG-YO", label: "Yobe" },
  { value: "NG-ZA", label: "Zamfara" },
];

export const isNigerianState = (code: string) =>
  NIGERIAN_STATES.some((state) => state.value === code);
