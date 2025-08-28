import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";
import { getBoolean, ValueNotFoundError } from "@/app/form/_utils/sessionStorage";

export interface Screening1Data {
  isSoleProprietor: "true" | "false" | "";
}

export interface ScreeningFormData {
  natureOfDisclosingEntity: DisclosingEntity.SoleProprietor;
}

export const getScreeningFormData = (): ScreeningFormData => {
  const isSoleProprietor = getBoolean("isSoleProprietor", true);
  if (isSoleProprietor !== true) {
    throw new ValueNotFoundError(`Expected isSoleProprietor to be true, was ${isSoleProprietor}`);
  }
  return {
    natureOfDisclosingEntity: DisclosingEntity.SoleProprietor,
  };
};
