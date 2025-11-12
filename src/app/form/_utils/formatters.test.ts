import { formatCityStateZipAddressSingleField } from "@/app/form/_utils/formatters";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

it("formatCityStateZipAddressSingleField", () => {
  expect(formatCityStateZipAddressSingleField("Trenton", AddressState.NJ, "11111")).toEqual(
    "Trenton, NJ 11111",
  );
});
