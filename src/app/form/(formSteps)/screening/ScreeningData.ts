import { getBoolean, ValueNotFoundError, type DataStore } from "@/app/form/_utils/dataStore";

export interface Screening1Data {
  isSoleProprietor: "true" | "false" | "";
}

export interface Screening2Data {
  everHadEmployees: "true" | "false" | "";
  everHadOtherBusinessOwner: "true" | "false" | "";
}

export interface Screening3Data {
  haveOtherBusinessOwnerNextYear: "true" | "false" | "";
  hadDhmasBusiness: "true" | "false" | "";
}

export interface ScreeningFormData {
  isSupportedSoleProprietor: boolean;
}

export const getScreeningFormData = (dataStore: DataStore): ScreeningFormData => {
  const isSoleProprietor = getBoolean(dataStore, "isSoleProprietor", true);
  const everHadEmployees = getBoolean(dataStore, "everHadEmployees", true);
  const everHadOtherBusinessOwner = getBoolean(dataStore, "everHadOtherBusinessOwner", true);
  const haveOtherBusinessOwnerNextYear = getBoolean(
    dataStore,
    "haveOtherBusinessOwnerNextYear",
    true,
  );
  const hadDhmasBusiness = getBoolean(dataStore, "hadDhmasBusiness", true);
  if (
    isSoleProprietor === true &&
    everHadEmployees === false &&
    everHadOtherBusinessOwner === false &&
    haveOtherBusinessOwnerNextYear === false &&
    hadDhmasBusiness === false
  ) {
    return {
      isSupportedSoleProprietor: true,
    };
  }

  throw new ValueNotFoundError(
    `Invalid screening answers: isSoleProprietor: ${isSoleProprietor}, everHadEmployees: ${everHadEmployees}, everHadOtherBusinessOwner ${everHadOtherBusinessOwner}, haveOtherBusinessOwnerNextYear ${haveOtherBusinessOwnerNextYear}, hadDhmasBusiness ${hadDhmasBusiness}`,
  );
};
