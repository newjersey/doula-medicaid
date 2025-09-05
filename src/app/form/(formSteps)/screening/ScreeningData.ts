import { getBoolean, ValueNotFoundError } from "@/app/form/_utils/sessionStorage";

export interface Screening1Data {
  isSoleProprietor: "true" | "false" | "";
}

export interface Screening2Data {
  everHadEmployees: "true" | "false" | "";
  everHadOtherBusinessOwner: "true" | "false" | "";
}

export interface ScreeningFormData {
  isSupportedSoleProprietor: boolean;
}

export const getScreeningFormData = (): ScreeningFormData => {
  const isSoleProprietor = getBoolean("isSoleProprietor", true);
  const everHadEmployees = getBoolean("everHadEmployees", true);
  const everHadOtherBusinessOwner = getBoolean("everHadOtherBusinessOwner", true);
  if (
    isSoleProprietor === true &&
    everHadEmployees === false &&
    everHadOtherBusinessOwner === false
  ) {
    return {
      isSupportedSoleProprietor: true,
    };
  }

  throw new ValueNotFoundError(
    `Invalid screening answers: isSoleProprietor: ${isSoleProprietor}, everHadEmployees: ${everHadEmployees}, everHadOtherBusinessOwner ${everHadOtherBusinessOwner}`,
  );
};
