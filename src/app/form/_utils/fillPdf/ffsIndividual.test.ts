import { mapFfsIndividualFields } from "../fillPdf/ffsIndividual";
import type { FormData } from "../fillPdf/form";
import { AddressState, DisclosingEntity } from "../inputFields/types";

describe("Individual FFS Form", () => {
  let formData: FormData;
  beforeEach(() => {
    formData = resetFormData();
  });

  describe("Disclosure of Ownership Section 1", () => {
    describe("Name Fields", () => {
      it("update the name field", () => {
        const result = mapFfsIndividualFields(formData);
        expect(result.fd452nameofdisclosingentity).toBe("Luna Middle Last");
      });

      it("no middle name", () => {
        formData.middleName = null;
        const result = mapFfsIndividualFields(formData);
        expect(result.fd452nameofdisclosingentity).toBe("Luna Last");
      });

      it("no first name", () => {
        formData.firstName = null;
        expect(() => {
          mapFfsIndividualFields(formData);
        }).toThrow("First name and last name are required to fill the name field.");
      });

      it("no last name", () => {
        formData.lastName = null;
        expect(() => {
          mapFfsIndividualFields(formData);
        }).toThrow("First name and last name are required to fill the name field.");
      });
    });

    it("no address line 2", () => {
      formData.streetAddress2 = null;
      const result = mapFfsIndividualFields(formData);
      expect(result.fd452businessstreetline2).toBe("");
    });

    it("fills Section 1 with FormData", () => {
      const result = mapFfsIndividualFields(formData);
      expect(result["fd452disclosingentitySole Proprietorship"]).toBe(true);
      expect(result.fd452tradenameanddba).toBe("N/A");

      expect(result.fd452businessstreetline1).toBe("123 Main St");
      expect(result.fd452businessstreetline2).toBe("Apt 4B");
      expect(result.fd452businessstreetline3).toBe("Trenton, NJ 11111");

      expect(result.fd452telephonenumber).toBe("111-111-1111");
      expect(result.fd452providernumbandornpi).toBe("111111111");
      expect(result.fd452einorothertaxidnumber).toBe("123-45-6789");
    });
  });
});

function resetFormData(): FormData {
  const formData: FormData = {
    firstName: "Luna",
    middleName: "Middle",
    lastName: "Last",
    dateOfBirth: new Date("1990-01-01"),
    streetAddress1: "123 Main St",
    streetAddress2: "Apt 4B",
    city: "Trenton",
    state: AddressState.NJ,
    zip: "11111",
    phoneNumber: "111-111-1111",
    npiNumber: "111111111",
    ssn: "123-45-6789",
    natureOfDisclosingEntity: DisclosingEntity.SP,
  };

  return formData;
}
