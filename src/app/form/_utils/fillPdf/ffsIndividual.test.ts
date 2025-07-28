import { AddressState, DisclosingEntity } from "../inputFields/enums";
import { mapFfsIndividualFields } from "./ffsIndividual";
import { type FormData } from "./form";

const generateFormData = (formDataOverrides: Partial<FormData>): FormData => {
  return {
    firstName: "First",
    middleName: null,
    lastName: "Last",
    dateOfBirth: null,
    phoneNumber: null,
    email: null,
    npiNumber: null,
    socialSecurityNumber: null,
    streetAddress1: null,
    streetAddress2: null,
    city: null,
    state: null,
    zip: null,
    natureOfDisclosingEntity: null,
    hasSameBusinessAddress: null,
    businessStreetAddress1: null,
    businessStreetAddress2: null,
    businessCity: null,
    businessState: null,
    businessZip: null,
    ...formDataOverrides,
  };
};

describe("mapFfsIndividualFields", () => {
  const testedFormKeys = new Set<string>([]);

  const testLegalName = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formDataWithMiddleName: FormData = generateFormData({
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
    });
    const fieldsToFillWithMiddleName = mapFfsIndividualFields(formDataWithMiddleName);
    expect(fieldsToFillWithMiddleName[formKey]).toEqual("First Middle Last");

    const formDataWithoutMiddleName: FormData = generateFormData({
      firstName: "First",
      lastName: "Last",
    });
    const fieldsToFillWithoutMiddleName = mapFfsIndividualFields(formDataWithoutMiddleName);
    expect(fieldsToFillWithoutMiddleName[formKey]).toEqual("First Last");

    const formDataWithoutFirstName: FormData = generateFormData({
      firstName: null,
      middleName: "Middle",
      lastName: "Last",
    });
    expect(() => {
      mapFfsIndividualFields(formDataWithoutFirstName);
    }).toThrow("First name and last name are required to fill the name field.");

    const formDataWithoutLastName: FormData = generateFormData({
      firstName: "First",
      middleName: "Middle",
      lastName: null,
    });
    expect(() => {
      mapFfsIndividualFields(formDataWithoutLastName);
    }).toThrow("First name and last name are required to fill the name field.");
  };

  const testDateOfBirth = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      dateOfBirth: new Date("1/2/1990"),
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("01/02/1990");
  };

  const testPhoneNumber = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      phoneNumber: "111-111-1111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("111-111-1111");
  };

  const testNpiNumber = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      npiNumber: "1111111111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("1111111111");
  };

  const testSocialSecurityNumber = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      socialSecurityNumber: "123-45-6789",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("123-45-6789");
  };

  const testEmail = (formKey: string) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      email: "test@test.com",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("test@test.com");
  };

  describe("Page 3 - doula qualifications form", () => {
    it("fills legal name", () => {
      testLegalName("fd427LegalName");
    });

    it("fills date of birth", () => {
      testDateOfBirth("fd427dateofbirthDate1_af_date");
    });

    it("fills social security number", () => {
      testSocialSecurityNumber("fd427SocialSecurityNumber");
    });
  });

  describe("Page 5 - authorization agreement for automated deposits of state payments", () => {
    it("fills phone number", () => {
      testPhoneNumber("fd443telephoneno");
    });

    it("fills NPI number", () => {
      testNpiNumber("fd443npino");
    });
  });

  describe("Page 7 - individual doula provider application section I provider identification", () => {
    it("fills legal name", () => {
      testLegalName("fd425legalname");
    });

    it("fills date of birth", () => {
      testDateOfBirth("fd452dobfdate_af_date");
    });

    it("fills NPI number", () => {
      testNpiNumber("fd425npinumber");
    });

    it("fills phone number", () => {
      testPhoneNumber("fd425telephoneno");
    });

    it("fills email address", () => {
      testEmail("fd425emailaddress");
    });

    it("fills social security number", () => {
      testSocialSecurityNumber("fd425socialsecuritynumber");
    });

    it("fills street address", () => {
      const formKey = "fd425mailtoaddressstreet";
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);

      const formDataOnlyAddress1: FormData = generateFormData({
        streetAddress1: "55 Cherry St",
      });
      const fieldsToFillOnlyAddress1 = mapFfsIndividualFields(formDataOnlyAddress1);
      expect(fieldsToFillOnlyAddress1[formKey]).toEqual("55 Cherry St");

      const formDataAddress1And2: FormData = generateFormData({
        streetAddress1: "55 Cherry St",
        streetAddress2: "Apt 4",
      });
      const fieldsToFillAddress1And2 = mapFfsIndividualFields(formDataAddress1And2);
      expect(fieldsToFillAddress1And2[formKey]).toEqual("55 Cherry St Apt 4");
    });

    it("fills city, state, and zip", () => {
      const cityStateZipKeys = [
        "fd425mailtoaddresscity",
        "fd425mailtoaddressstate",
        "fd425mailtoaddresszip",
      ];
      for (const formKey of cityStateZipKeys) {
        expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
        testedFormKeys.add(formKey);
      }
      const [cityKey, stateKey, zipKey] = cityStateZipKeys;

      const formData: FormData = generateFormData({
        city: "Newark",
        state: AddressState.NJ,
        zip: "08609",
      });
      const fieldsToFill = mapFfsIndividualFields(formData);
      expect(fieldsToFill[cityKey]).toEqual("Newark");
      expect(fieldsToFill[stateKey]).toEqual("NJ");
      expect(fieldsToFill[zipKey]).toEqual("08609");
    });
  });

  describe("Page 12 - request for paper updates", () => {
    it("fills legal name", () => {
      testLegalName("fd455aREQPAPER_Provider Name");
    });

    it("fills NPI number", () => {
      testNpiNumber("fd455aREQPAPER_Provider Number");
    });

    it("fills phone number", () => {
      testPhoneNumber("fd455aREQPAPER_Telephone Number");
    });

    it("fills mail to address", () => {
      const mailToAddressKeys = [
        "fd455aREQPAPER_Mail To Address 1",
        "fd455aREQPAPER_Mail To Address 2",
        "fd455aREQPAPER_Mail To Address 3",
      ];
      for (const formKey of mailToAddressKeys) {
        expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
        testedFormKeys.add(formKey);
      }
      const [address1Key, address2Key, address3Key] = mailToAddressKeys;

      const formData: FormData = generateFormData({
        streetAddress1: "55 Cherry St",
        streetAddress2: "Apt 4",
        city: "Newark",
        state: AddressState.NJ,
        zip: "08609",
      });
      const fieldsToFill = mapFfsIndividualFields(formData);
      expect(fieldsToFill[address1Key]).toEqual("55 Cherry St");
      expect(fieldsToFill[address2Key]).toEqual("Apt 4");
      expect(fieldsToFill[address3Key]).toEqual("Newark, NJ 08609");
    });
  });

  describe("Page 16 - disclosing entity sole proprietorship", () => {
    describe("when disclosing entity is not Sole Proprietorship", () => {
      it("it does not fill the page 16 fields", () => {
        const formData: FormData = generateFormData({
          natureOfDisclosingEntity: null,
          firstName: "First",
          middleName: "Middle",
          lastName: "Last",
          phoneNumber: "111-111-1111",
          socialSecurityNumber: "123-45-6789",
          npiNumber: "1111111111",
        });
        const fieldsToFill = mapFfsIndividualFields(formData);
        expect(fieldsToFill["fd452disclosingentitySole Proprietorship"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityPaternship"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityCorporation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentitylimitedliabilitycompany"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityNonprofitorganization"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityUnincorporatedAssociation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityOther"]).toBeUndefined();

        expect(fieldsToFill["fd452nameofdisclosingentity"]).toBeUndefined();
        expect(fieldsToFill["fd452telephonenumber"]).toBeUndefined();
        expect(fieldsToFill["fd452providernumbandornpi"]).toBeUndefined();
        expect(fieldsToFill["fd452einorothertaxidnumber"]).toBeUndefined();
      });
    });

    describe("when disclosing entity is Sole Proprietorship and business address is the same as mailing address", () => {
      it("fills the page 16 fields", () => {
        const formData: FormData = generateFormData({
          natureOfDisclosingEntity: DisclosingEntity.SoleProprietorship,
          firstName: "First",
          middleName: "Middle",
          lastName: "Last",
          phoneNumber: "111-111-1111",
          socialSecurityNumber: "123-45-6789",
          npiNumber: "1111111111",
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Trenton",
          state: AddressState.NJ,
          zip: "11111",
          hasSameBusinessAddress: true,
        });
        const fieldsToFill = mapFfsIndividualFields(formData);
        expect(fieldsToFill["fd452disclosingentitySole Proprietorship"]).toEqual(true);
        expect(fieldsToFill["fd452disclosingentityPaternship"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityCorporation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentitylimitedliabilitycompany"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityNonprofitorganization"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityUnincorporatedAssociation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityOther"]).toBeUndefined();
        expect(fieldsToFill["fd452nameofdisclosingentity"]).toEqual("First Middle Last");
        expect(fieldsToFill["fd452telephonenumber"]).toEqual("111-111-1111");
        expect(fieldsToFill["fd452providernumbandornpi"]).toEqual("1111111111");
        expect(fieldsToFill["fd452businessstreetline1"]).toEqual("123 Main St");
        expect(fieldsToFill["fd452businessstreetline2"]).toEqual("Apt 4B");
        expect(fieldsToFill["fd452businessstreetline3"]).toEqual("Trenton, NJ 11111");
      });
    });

    describe("when disclosing entity is Sole Proprietorship and business address is different from mailing address", () => {
      it("fills the page 16 fields", () => {
        const formData: FormData = generateFormData({
          natureOfDisclosingEntity: DisclosingEntity.SoleProprietorship,
          firstName: "First",
          middleName: "Middle",
          lastName: "Last",
          phoneNumber: "111-111-1111",
          socialSecurityNumber: "123-45-6789",
          npiNumber: "1111111111",
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Trenton",
          state: AddressState.NJ,
          zip: "11111",
          hasSameBusinessAddress: false,
          businessStreetAddress1: "456 Test St",
          businessStreetAddress2: "Suite Test",
          businessCity: "Trenton",
          businessState: AddressState.NJ,
          businessZip: "22222",
        });
        const fieldsToFill = mapFfsIndividualFields(formData);
        expect(fieldsToFill["fd452disclosingentitySole Proprietorship"]).toEqual(true);
        expect(fieldsToFill["fd452disclosingentityPaternship"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityCorporation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentitylimitedliabilitycompany"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityNonprofitorganization"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityUnincorporatedAssociation"]).toBeUndefined();
        expect(fieldsToFill["fd452disclosingentityOther"]).toBeUndefined();
        expect(fieldsToFill["fd452nameofdisclosingentity"]).toEqual("First Middle Last");
        expect(fieldsToFill["fd452telephonenumber"]).toEqual("111-111-1111");
        expect(fieldsToFill["fd452providernumbandornpi"]).toEqual("1111111111");
        expect(fieldsToFill["fd452businessstreetline1"]).toEqual("456 Test St");
        expect(fieldsToFill["fd452businessstreetline2"]).toEqual("Suite Test");
        expect(fieldsToFill["fd452businessstreetline3"]).toEqual("Trenton, NJ 22222");
        expect(fieldsToFill["fd452einorothertaxidnumber"]).toEqual("123-45-6789");
      });
    });
  });
});
