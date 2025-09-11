import type { AddressState } from "@/app/form/_utils/inputFields/enums";

export const formatAddressLine3 = (city: string, state: AddressState, zip: string): string => {
  return `${city}, ${state} ${zip}`;
};
