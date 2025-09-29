import { getBoolean, ValueNotFoundError } from "@/app/form/_utils/dataStore";

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

export const getScreeningFormData = (): ScreeningFormData => {
  const isSoleProprietor = getBoolean("isSoleProprietor", true);
  const everHadEmployees = getBoolean("everHadEmployees", true);
  const everHadOtherBusinessOwner = getBoolean("everHadOtherBusinessOwner", true);
  const haveOtherBusinessOwnerNextYear = getBoolean("haveOtherBusinessOwnerNextYear", true);
  const hadDhmasBusiness = getBoolean("hadDhmasBusiness", true);
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
