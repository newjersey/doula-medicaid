import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import {
  formatEinOrSsn,
  formatMultilineAddress,
  formatNaIfBlank,
  formatNumericStringAsIndividualFields,
} from "@/app/form/_utils/fillPdf/formatters";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("formatNaIfBlank", () => {
  it("returns the value if the value is not blank", () => {
    expect(formatNaIfBlank("test")).toEqual("test");
  });

  it("returns N/A if the value is null", () => {
    expect(formatNaIfBlank(null)).toEqual("N/A");
  });

  it("returns N/A if the value is an empty string", () => {
    expect(formatNaIfBlank("")).toEqual("N/A");
  });

  it("returns N/A if the value is a string with only whitespace", () => {
    expect(formatNaIfBlank("     ")).toEqual("N/A");
  });
});

describe("formatNumericStringAsIndividualFields", () => {
  it("pairs each character in the numeric string with fieldKeys in their provided order", () => {
    expect(formatNumericStringAsIndividualFields("123", ["one", "two", "three"])).toEqual({
      one: "1",
      two: "2",
      three: "3",
    });
  });

  it.each([["1-1"], ["1 1"], ["1a1"]])(
    "throws an error if the numeric string is $1",
    (invalidNumericString) => {
      expect(() => {
        formatNumericStringAsIndividualFields(invalidNumericString, ["one", "two", "three"]);
      }).toThrow(`${invalidNumericString} contains non-numeric characters`);
    },
  );

  it("throws an error if length of the numeric string doesn't match the number of fieldKeys", () => {
    expect(() => {
      formatNumericStringAsIndividualFields("123", ["one", "two"]);
    }).toThrow("123 is a different length than one,two");
  });
});

describe("formatMultilineAddress", () => {
  it("includes street address 2 if present", () => {
    expect(formatMultilineAddress("Street 1", "Apt 2", "Newark", AddressState.NJ, "99999"))
      .toEqual(`Street 1
Apt 2
Newark, NJ 99999`);
  });

  it("excludes street address 2 if present", () => {
    expect(formatMultilineAddress("Street 1", null, "Newark", AddressState.NJ, "99999"))
      .toEqual(`Street 1
Newark, NJ 99999`);
  });
});

describe("formatEinOrSsn", () => {
  it("returns the EIN if hasEin is true", () => {
    expect(
      formatEinOrSsn(
        generateFormData({ hasEin: true, ein: "11-1111111", socialSecurityNumber: "555-55-5555" }),
      ),
    ).toEqual("11-1111111");
  });

  it("returns the SSN if hasEin is false", () => {
    expect(
      formatEinOrSsn(
        generateFormData({ hasEin: false, ein: "11-1111111", socialSecurityNumber: "555-55-5555" }),
      ),
    ).toEqual("555-55-5555");
  });

  it("throws an UnexpectedFormDataError if hasEin is true but EIN is null", () => {
    const testFunction = () =>
      formatEinOrSsn(
        generateFormData({ hasEin: true, ein: null, socialSecurityNumber: "555-55-5555" }),
      );
    expect(testFunction).toThrow(UnexpectedFormDataError);
    expect(testFunction).toThrow("hasEin is true but ein is null");
  });
});
