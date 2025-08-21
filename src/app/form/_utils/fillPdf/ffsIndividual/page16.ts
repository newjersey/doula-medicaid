import {
  formatAddressLine3,
  formatBusinessAddressLine3,
  formatName,
} from "@/app/form/_utils/fillPdf/formatters";
import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 16 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage16 {
  "fd452disclosingentitySole Proprietorship": boolean;
  fd452disclosingentityPaternship: boolean;
  fd452disclosingentityCorporation: boolean;
  fd452disclosingentitylimitedliabilitycompany: boolean;
  fd452disclosingentityNonprofitorganization: boolean;
  fd452disclosingentityUnincorporatedAssociation: boolean;
  fd452disclosingentityOther: boolean;
  fd452disclosingentityOtherSpecifytext: string;
  fd452nameofdisclosingentity: string;
  fd452tradenameanddba: string;
  fd452businessstreetline1: string;
  fd452businessstreetline2: string;
  fd452businessstreetline3: string;
  fd452telephonenumber: string;
  fd452providernumbandornpi: string;
  fd452einorothertaxidnumber: string;
  fd452ownershipoffivepercentormoreyes: boolean;
  fd452ownershipoffivepercentormoreno: boolean;
  fd452convictedofcrimeyes: boolean;
  fd452convictedofcrimeno: boolean;
}

export const getPage16Fields = (formData: FormData): Partial<PdfFfsIndividualPage16> => {
  if (formData.natureOfDisclosingEntity == DisclosingEntity.SoleProprietorship) {
    const soleProprietorshipFields = {
      "fd452disclosingentitySole Proprietorship": true,
      fd452nameofdisclosingentity: formatName(formData),
      fd452telephonenumber: formData.phoneNumber ?? "",
      fd452providernumbandornpi: formData.npiNumber ?? "",
      fd452einorothertaxidnumber: formData.socialSecurityNumber ?? "",
    };

    if (formData.hasSameBusinessAddress === true) {
      return {
        ...soleProprietorshipFields,
        fd452businessstreetline1: formData.streetAddress1 || "",
        fd452businessstreetline2: formData.streetAddress2 || "",
        fd452businessstreetline3: formatAddressLine3(formData),
      };
    } else if (formData.hasSameBusinessAddress === false) {
      return {
        ...soleProprietorshipFields,
        fd452businessstreetline1: formData.businessStreetAddress1 || "",
        fd452businessstreetline2: formData.businessStreetAddress2 || "",
        fd452businessstreetline3: formatBusinessAddressLine3(formData),
      };
    }
  }

  return {};
};
