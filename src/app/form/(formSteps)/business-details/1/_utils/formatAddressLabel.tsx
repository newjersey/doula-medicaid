import { formatAddressLine3 } from "@/app/form/_utils/formatters";
import type { AddressState } from "@/app/form/_utils/inputFields/enums";

export const formatAddressLabel = (
  streetAddress1: string,
  streetAddress2: string | null,
  city: string,
  state: AddressState,
  zip: string,
) => {
  const addressParts = [{ key: "addressLine1", value: streetAddress1 }];
  if (streetAddress2 !== null) {
    addressParts.push({ key: "addressLine2", value: streetAddress2 });
  }
  addressParts.push({ key: "addressLine3", value: formatAddressLine3(city, state, zip) });

  return (
    <div className="usa-hint">
      {addressParts.map((addressPart) => (
        <div key={addressPart.key}>{addressPart.value}</div>
      ))}
    </div>
  );
};
