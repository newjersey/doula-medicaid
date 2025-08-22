import {
  mapFfsIndividualFields,
  type PdfFfsIndividual,
} from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { type FormData } from "@form/_utils/fillPdf/form";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";

describe("mapFfsIndividualFields", () => {
  const testedFormKeys = new Set<string>([]);

  const testLegalName = (formKey: keyof PdfFfsIndividual) => {
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
  };

  const testDateOfBirth = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      dateOfBirth: new Date("1/2/1990"),
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("01/02/1990");
  };

  const testPhoneNumber = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      phoneNumber: "111-111-1111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("111-111-1111");
  };

  const testNpiNumber = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      npiNumber: "1111111111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("1111111111");
  };

  const testSocialSecurityNumber = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      socialSecurityNumber: "123-45-6789",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("123-45-6789");
  };

  const testEmail = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      email: "test@test.com",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("test@test.com");
  };

  const testBillingAddressLine1 = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      billingStreetAddress1: "123 Main St",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("123 Main St");
  };

  const testBillingAddressLine2 = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      billingStreetAddress2: "Apt 2F",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("Apt 2F");
  };

  const testBillingAddressLine3 = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formData: FormData = generateFormData({
      billingCity: "Trenton",
      billingState: AddressState.NJ,
      billingZip: "11111",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[formKey]).toEqual("Trenton, NJ 11111");
  };

  const testTrainingStreetAddress = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formDataOnlyAddress1: FormData = generateFormData({
      isDoulaTrainingInPerson: true,
      trainingStreetAddress1: "55 Cherry St",
    });
    const fieldsToFillOnlyAddress1 = mapFfsIndividualFields(formDataOnlyAddress1);
    expect(fieldsToFillOnlyAddress1[formKey]).toEqual("55 Cherry St");

    const formDataAddress1And2: FormData = generateFormData({
      isDoulaTrainingInPerson: true,
      trainingStreetAddress1: "55 Cherry St",
      trainingStreetAddress2: "Apt 4",
    });
    const fieldsToFillAddress1And2 = mapFfsIndividualFields(formDataAddress1And2);
    expect(fieldsToFillAddress1And2[formKey]).toEqual("55 Cherry St Apt 4");

    const formDataAddressNull: FormData = generateFormData({
      isDoulaTrainingInPerson: false,
      trainingStreetAddress1: "",
      trainingStreetAddress2: "",
    });
    const fieldsToFillAddressNull = mapFfsIndividualFields(formDataAddressNull);
    expect(fieldsToFillAddressNull[formKey]).toEqual("Virtual");
  };

  const testTrainingCityStateZip = (
    cityKey: keyof PdfFfsIndividual,
    stateKey: keyof PdfFfsIndividual,
    zipKey: keyof PdfFfsIndividual,
  ) => {
    const cityStateZipKeys = [cityKey, stateKey, zipKey];
    for (const formKey of cityStateZipKeys) {
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);
    }

    const formData: FormData = generateFormData({
      isDoulaTrainingInPerson: true,
      trainingCity: "Newark",
      trainingState: AddressState.NJ,
      trainingZip: "08609",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[cityKey]).toEqual("Newark");
    expect(fieldsToFill[stateKey]).toEqual("NJ");
    expect(fieldsToFill[zipKey]).toEqual("08609");
  };

  const testStreetAddress = (formKey: keyof PdfFfsIndividual) => {
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
  };

  const testCityStateZip = (
    cityKey: keyof PdfFfsIndividual,
    stateKey: keyof PdfFfsIndividual,
    zipKey: keyof PdfFfsIndividual,
  ) => {
    const cityStateZipKeys = [cityKey, stateKey, zipKey];
    for (const formKey of cityStateZipKeys) {
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);
    }

    const formData: FormData = generateFormData({
      city: "Newark",
      state: AddressState.NJ,
      zip: "08609",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[cityKey]).toEqual("Newark");
    expect(fieldsToFill[stateKey]).toEqual("NJ");
    expect(fieldsToFill[zipKey]).toEqual("08609");
  };

  const testBillingCityStateZip = (
    cityKey: keyof PdfFfsIndividual,
    stateKey: keyof PdfFfsIndividual,
    zipKey: keyof PdfFfsIndividual,
  ) => {
    const cityStateZipKeys = [cityKey, stateKey, zipKey];
    for (const formKey of cityStateZipKeys) {
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);
    }

    const formData: FormData = generateFormData({
      billingCity: "Newark",
      billingState: AddressState.NJ,
      billingZip: "08609",
    });
    const fieldsToFill = mapFfsIndividualFields(formData);
    expect(fieldsToFill[cityKey]).toEqual("Newark");
    expect(fieldsToFill[stateKey]).toEqual("NJ");
    expect(fieldsToFill[zipKey]).toEqual("08609");
  };

  const testBillingStreetAddress = (formKey: keyof PdfFfsIndividual) => {
    expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
    testedFormKeys.add(formKey);

    const formDataOnlyAddress1: FormData = generateFormData({
      billingStreetAddress1: "55 Cherry St",
    });
    const fieldsToFillOnlyAddress1 = mapFfsIndividualFields(formDataOnlyAddress1);
    expect(fieldsToFillOnlyAddress1[formKey]).toEqual("55 Cherry St");

    const formDataAddress1And2: FormData = generateFormData({
      billingStreetAddress1: "55 Cherry St",
      billingStreetAddress2: "Apt 4",
    });
    const fieldsToFillAddress1And2 = mapFfsIndividualFields(formDataAddress1And2);
    expect(fieldsToFillAddress1And2[formKey]).toEqual("55 Cherry St Apt 4");
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

    describe("doula training fields", () => {
      describe("when user selects a state approved training", () => {
        it("fills the selected approved training", () => {
          const formData: FormData = generateFormData({
            stateApprovedTraining: "Children's Futures (Trenton)",
            nameOfTrainingOrganization: null,
          });
          const fieldsToFill = mapFfsIndividualFields(formData);
          expect(fieldsToFill["fd427TrainingProgramName"]).toEqual("Children's Futures (Trenton)");
        });
      });

      describe("when user provides the name of a non-approved training", () => {
        it("fills the provided training", () => {
          const formData: FormData = generateFormData({
            stateApprovedTraining: "None of these",
            nameOfTrainingOrganization: "Name of training org",
          });
          const fieldsToFill = mapFfsIndividualFields(formData);
          expect(fieldsToFill["fd427TrainingProgramName"]).toEqual("Name of training org");
        });
      });

      it("fills in training instructor fields", () => {
        const formData: FormData = generateFormData({
          instructorFirstName: "First",
          instructorLastName: "Last",
          instructorEmail: "test@example.com",
          instructorPhoneNumber: "111-111-1111",
        });
        const fieldsToFill = mapFfsIndividualFields(formData);
        expect(fieldsToFill["fd427TrainingProgramContact"]).toEqual("First Last");
        expect(fieldsToFill["fd427trainingprogramcontanctE-mailAddress"]).toEqual(
          "test@example.com",
        );
        expect(fieldsToFill["fd427trainingprogramcontactTelephoneNo"]).toEqual("111-111-1111");
      });

      it("fills doula street address1", () => {
        testTrainingStreetAddress("fd427trainingsiteStreetaddress");
      });

      it("fills doula training address city", () => {
        testTrainingCityStateZip(
          "fd427trainingsiteCity",
          "fd427trainingsiteState",
          "fd427trainingsiteZip",
        );
      });

      it("throws an UnexpectedFormDataError when formData contains None of these but no Training Organization", () => {
        const formData: FormData = generateFormData({
          stateApprovedTraining: "None of these",
        });
        expect(() => mapFfsIndividualFields(formData)).toThrow(
          "stateApprovedTraining had value none of these, but no training organization was provided.",
        );
      });
    });
  });

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
      const formKey = "fd452medicareprovnumber";
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);

      const fieldsToFill = mapFfsIndividualFields(
        generateFormData({
          medicareProviderId: "111111",
        }),
      );
      expect(fieldsToFill[formKey]).toEqual("111111");

      for (const emptyValue of [null, "", "   "]) {
        const fieldsToFill = mapFfsIndividualFields(
          generateFormData({
            medicareProviderId: emptyValue,
          }),
        );
        expect(fieldsToFill[formKey]).toEqual("N/A");
      }
    });

    it("fills UPIN number", () => {
      const formKey = "fd425upinno";
      expect(testedFormKeys.has(formKey), `Duplicate test for ${formKey}`).toEqual(false);
      testedFormKeys.add(formKey);

      const fieldsToFill = mapFfsIndividualFields(
        generateFormData({
          upinNumber: "ABC123",
        }),
      );
      expect(fieldsToFill[formKey]).toEqual("ABC123");
      for (const emptyValue of [null, "", "   "]) {
        const fieldsToFill = mapFfsIndividualFields(
          generateFormData({
            upinNumber: emptyValue,
          }),
        );
        expect(fieldsToFill[formKey]).toEqual("N/A");
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
