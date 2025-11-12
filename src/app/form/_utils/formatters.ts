import type { AddressState } from "@/app/form/_utils/inputFields/addressState";

export const formatCityStateZipAddressSingleField = (
  city: string,
  state: AddressState,
  zip: string,
): string => {
  return `${city}, ${state} ${zip}`;
};
