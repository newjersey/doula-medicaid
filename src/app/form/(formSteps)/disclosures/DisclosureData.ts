export interface DisclosureData {
  isSoleProprietorship: "true" | "false" | "";
  hasSameBusinessAddress: "true" | "false" | "";
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
}
