import {
  mapFfsIndividualFields,
  type PdfFfsIndividual,
} from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { type FormData } from "@form/_utils/fillPdf/form";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";

describe("mapFfsIndividualFields", () => {
  const testedPdfKeys = new Set<string>([]);

  const testLegalName = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formDataWithMiddleName: FormData = generateFormData({
      firstName: "First",
      middleName: "Middle",
      lastName: "Last",
    });
    const fieldsToFillWithMiddleName = mapFfsIndividualFields(formDataWithMiddleName);
    expect(fieldsToFillWithMiddleName[pdfKey]).toEqual("First Middle Last");

    const formDataWithoutMiddleName: FormData = generateFormData({
      firstName: "First",
      lastName: "Last",
    });
    const fieldsToFillWithoutMiddleName = mapFfsIndividualFields(formDataWithoutMiddleName);
    expect(fieldsToFillWithoutMiddleName[pdfKey]).toEqual("First Last");
  };

  const testDateOfBirth = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      dateOfBirth: new Date("1/2/1990"),
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[pdfKey]).toEqual("01/02/1990");
  };

  const testPhoneNumber = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      phoneNumber: "111-111-1111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[pdfKey]).toEqual("111-111-1111");
  };

  const testNpiNumber = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      npiNumber: "1111111111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[pdfKey]).toEqual("1111111111");
  };

  const testSocialSecurityNumber = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      socialSecurityNumber: "123-45-6789",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[pdfKey]).toEqual("123-45-6789");
  };

  const testEmail = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      email: "test@test.com",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[pdfKey]).toEqual("test@test.com");
  };

  const testBillingAddressLine1 = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      billingStreetAddress1: "123 Main St",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[pdfKey]).toEqual("123 Main St");
  };

  const testBillingAddressLine2 = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      billingStreetAddress2: "Apt 2F",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[pdfKey]).toEqual("Apt 2F");
  };

  const testBillingAddressLine3 = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formData: FormData = generateFormData({
      billingCity: "Trenton",
      billingState: AddressState.NJ,
      billingZip: "11111",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[pdfKey]).toEqual("Trenton, NJ 11111");
  };

  const testStreetAddress = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formDataOnlyAddress1: FormData = generateFormData({
      streetAddress1: "55 Cherry St",
    });
    const pdfFieldsOnlyAddress1 = mapFfsIndividualFields(formDataOnlyAddress1);
    expect(pdfFieldsOnlyAddress1[pdfKey]).toEqual("55 Cherry St");

    const formDataAddress1And2: FormData = generateFormData({
      streetAddress1: "55 Cherry St",
      streetAddress2: "Apt 4",
    });
    const pdfFieldsAddress1And2 = mapFfsIndividualFields(formDataAddress1And2);
    expect(pdfFieldsAddress1And2[pdfKey]).toEqual("55 Cherry St Apt 4");
  };

  const testCityStateZip = (
    cityKey: keyof PdfFfsIndividual,
    stateKey: keyof PdfFfsIndividual,
    zipKey: keyof PdfFfsIndividual,
  ) => {
    const cityStateZipKeys = [cityKey, stateKey, zipKey];
    for (const pdfKey of cityStateZipKeys) {
      expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
      testedPdfKeys.add(pdfKey);
    }

    const formData: FormData = generateFormData({
      city: "Newark",
      state: AddressState.NJ,
      zip: "08609",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[cityKey]).toEqual("Newark");
    expect(pdfFields[stateKey]).toEqual("NJ");
    expect(pdfFields[zipKey]).toEqual("08609");
  };

  const testBillingCityStateZip = (
    cityKey: keyof PdfFfsIndividual,
    stateKey: keyof PdfFfsIndividual,
    zipKey: keyof PdfFfsIndividual,
  ) => {
    const cityStateZipKeys = [cityKey, stateKey, zipKey];
    for (const pdfKey of cityStateZipKeys) {
      expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
      testedPdfKeys.add(pdfKey);
    }

    const formData: FormData = generateFormData({
      billingCity: "Newark",
      billingState: AddressState.NJ,
      billingZip: "08609",
    });
    const pdfFields = mapFfsIndividualFields(formData);
    expect(pdfFields[cityKey]).toEqual("Newark");
    expect(pdfFields[stateKey]).toEqual("NJ");
    expect(pdfFields[zipKey]).toEqual("08609");
  };

  const testBillingStreetAddress = (pdfKey: keyof PdfFfsIndividual) => {
    expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
    testedPdfKeys.add(pdfKey);

    const formDataOnlyAddress1: FormData = generateFormData({
      billingStreetAddress1: "55 Cherry St",
    });
    const pdfFieldsOnlyAddress1 = mapFfsIndividualFields(formDataOnlyAddress1);
    expect(pdfFieldsOnlyAddress1[pdfKey]).toEqual("55 Cherry St");

    const formDataAddress1And2: FormData = generateFormData({
      billingStreetAddress1: "55 Cherry St",
      billingStreetAddress2: "Apt 4",
    });
    const pdfFieldsAddress1And2 = mapFfsIndividualFields(formDataAddress1And2);
    expect(pdfFieldsAddress1And2[pdfKey]).toEqual("55 Cherry St Apt 4");
  };

  describe("Page 5 - authorization agreement for automated deposits of state payments", () => {
    it("fills phone number", () => {
      testPhoneNumber("fd443telephoneno");
    });

    it("fills NPI number", () => {
      testNpiNumber("fd443npino");
    });

    it("fills billing address line 1", () => {
      testBillingAddressLine1("fd443paytoaddressline1");
    });

    it("fills billing address line 2", () => {
      testBillingAddressLine2("fd443paytoaddressline2");
    });

    it("fills billing address line 3", () => {
      testBillingAddressLine3("fd443paytoaddressline3");
    });
  });

  describe("Page 7 - individual doula provider application section I provider identification", () => {
    it("fills legal name", () => {
      testLegalName("fd425legalname");
    });

    it("fills date of birth", () => {
      testDateOfBirth("fd452dobfdate_af_date");
    });

    it("fills Medicare provider id", () => {
      const pdfKey = "fd452medicareprovnumber";
      expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
      testedPdfKeys.add(pdfKey);

      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          medicareProviderId: "111111",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("111111");

      for (const emptyValue of [null, "", "   "]) {
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            medicareProviderId: emptyValue,
          }),
        );
        expect(pdfFields[pdfKey]).toEqual("N/A");
      }
    });

    it("fills UPIN number", () => {
      const pdfKey = "fd425upinno";
      expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
      testedPdfKeys.add(pdfKey);

      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          upinNumber: "ABC123",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("ABC123");
      for (const emptyValue of [null, "", "   "]) {
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            upinNumber: emptyValue,
          }),
        );
        expect(pdfFields[pdfKey]).toEqual("N/A");
      }
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
      testStreetAddress("fd425mailtoaddressstreet");
    });

    it("fills city, state, and zip", () => {
      testCityStateZip(
        "fd425mailtoaddresscity",
        "fd425mailtoaddressstate",
        "fd425mailtoaddresszip",
      );
    });

    it("fills billing street address", () => {
      testBillingStreetAddress("fd425paytoaddressstreet");
    });

    it("fills billing city, state, and zip", () => {
      testBillingCityStateZip(
        "fd425paytoaddresscity",
        "fd425paytoaddressstate",
        "fd425paytoaddresszip",
      );
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
      const mailToAddressKeys: Array<keyof PdfFfsIndividual> = [
        "fd455aREQPAPER_Mail To Address 1",
        "fd455aREQPAPER_Mail To Address 2",
        "fd455aREQPAPER_Mail To Address 3",
      ];
      for (const pdfKey of mailToAddressKeys) {
        expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey}`).toEqual(false);
        testedPdfKeys.add(pdfKey);
      }
      const [address1Key, address2Key, address3Key] = mailToAddressKeys;

      const formData: FormData = generateFormData({
        streetAddress1: "55 Cherry St",
        streetAddress2: "Apt 4",
        city: "Newark",
        state: AddressState.NJ,
        zip: "08609",
      });
      const pdfFields = mapFfsIndividualFields(formData);
      expect(pdfFields[address1Key]).toEqual("55 Cherry St");
      expect(pdfFields[address2Key]).toEqual("Apt 4");
      expect(pdfFields[address3Key]).toEqual("Newark, NJ 08609");
    });
  });

  describe("Page 16 - disclosing entity sole proprietorship", () => {
    describe("when disclosing entity is Sole Proprietorship and business address is the same as mailing address", () => {
      it("fills the page 16 fields", () => {
        const formData: FormData = generateFormData({
          natureOfDisclosingEntity: DisclosingEntity.SoleProprietor,
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
        const pdfFields = mapFfsIndividualFields(formData);
        expect(pdfFields["fd452disclosingentitySole Proprietorship"]).toEqual(true);
        expect(pdfFields["fd452disclosingentityPaternship"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityCorporation"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentitylimitedliabilitycompany"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityNonprofitorganization"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityUnincorporatedAssociation"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityOther"]).toBeUndefined();
        expect(pdfFields["fd452nameofdisclosingentity"]).toEqual("First Middle Last");
        expect(pdfFields["fd452telephonenumber"]).toEqual("111-111-1111");
        expect(pdfFields["fd452providernumbandornpi"]).toEqual("1111111111");
        expect(pdfFields["fd452businessstreetline1"]).toEqual("123 Main St");
        expect(pdfFields["fd452businessstreetline2"]).toEqual("Apt 4B");
        expect(pdfFields["fd452businessstreetline3"]).toEqual("Trenton, NJ 11111");
      });
    });

    describe("when disclosing entity is Sole Proprietorship and business address is different from mailing address", () => {
      it("fills the page 16 fields", () => {
        const formData: FormData = generateFormData({
          natureOfDisclosingEntity: DisclosingEntity.SoleProprietor,
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
        const pdfFields = mapFfsIndividualFields(formData);
        expect(pdfFields["fd452disclosingentitySole Proprietorship"]).toEqual(true);
        expect(pdfFields["fd452disclosingentityPaternship"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityCorporation"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentitylimitedliabilitycompany"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityNonprofitorganization"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityUnincorporatedAssociation"]).toBeUndefined();
        expect(pdfFields["fd452disclosingentityOther"]).toBeUndefined();
        expect(pdfFields["fd452nameofdisclosingentity"]).toEqual("First Middle Last");
        expect(pdfFields["fd452telephonenumber"]).toEqual("111-111-1111");
        expect(pdfFields["fd452providernumbandornpi"]).toEqual("1111111111");
        expect(pdfFields["fd452businessstreetline1"]).toEqual("456 Test St");
        expect(pdfFields["fd452businessstreetline2"]).toEqual("Suite Test");
        expect(pdfFields["fd452businessstreetline3"]).toEqual("Trenton, NJ 22222");
        expect(pdfFields["fd452einorothertaxidnumber"]).toEqual("123-45-6789");
      });
    });
  });
});
