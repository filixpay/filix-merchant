/**
 * Registration countries for formal onboarding / maintenance.
 * Only countries with a backend Application Schema are listed.
 */
export type RegistrationCountryCode = "CN" | "HK" | "SG" | "US" | "GB" | "DE";

export type RegistrationCountryRegion =
  | "GREATER_CHINA"
  | "ASIA_PACIFIC"
  | "NORTH_AMERICA"
  | "EUROPE";

export type RegistrationCountryOption = {
  value: RegistrationCountryCode;
  /** i18n key under Onboarding.countries.* or Maintenance.countries.* */
  labelKey: RegistrationCountryCode;
};

export type RegistrationCountryGroup = {
  region: RegistrationCountryRegion;
  options: RegistrationCountryOption[];
};

/** Grouped by major region — aligned with Merchant Lifecycle §4.3 examples. */
export const REGISTRATION_COUNTRY_GROUPS: RegistrationCountryGroup[] = [
  {
    region: "GREATER_CHINA",
    options: [{ value: "CN", labelKey: "CN" }],
  },
  {
    region: "ASIA_PACIFIC",
    options: [
      { value: "HK", labelKey: "HK" },
      { value: "SG", labelKey: "SG" },
    ],
  },
  {
    region: "NORTH_AMERICA",
    options: [{ value: "US", labelKey: "US" }],
  },
  {
    region: "EUROPE",
    options: [
      { value: "GB", labelKey: "GB" },
      { value: "DE", labelKey: "DE" },
    ],
  },
];

export const REGISTRATION_COUNTRY_CODES: RegistrationCountryCode[] =
  REGISTRATION_COUNTRY_GROUPS.flatMap((group) => group.options.map((item) => item.value));
