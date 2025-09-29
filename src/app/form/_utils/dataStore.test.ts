import {
  getAddressState,
  getBoolean,
  getBusinessAddressSameAsOtherAddress,
  getDefaultBoolean,
  getValue,
} from "@/app/form/_utils/dataStore";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("getValue", () => {
  it("returns the value in the data store", () => {
    window.sessionStorage.setItem("firstName", "test name");
    expect(getValue("firstName", true)).toEqual("test name");
    expect(getValue("firstName", false)).toEqual("test name");
  });

  it("throws an error if required is true but the key is not present", () => {
    expect(() => getValue("firstName", true)).toThrow("firstName is unexpectedly null");
  });

  it("returns null if required is false and the key is not present", () => {
    expect(getValue("firstName", false)).toEqual(null);
  });
});

describe("getDefaultBooleanString", () => {
  it("returns an empty string if the value is not in the data store", () => {
    expect(getDefaultBoolean("isSoleProprietor")).toEqual("");
  });

  it("returns the value in the data store as a true or false string", () => {
    window.sessionStorage.setItem("isSoleProprietor", "true");
    expect(getDefaultBoolean("isSoleProprietor")).toEqual("true");

    window.sessionStorage.setItem("isSoleProprietor", "false");
    expect(getDefaultBoolean("isSoleProprietor")).toEqual("false");
  });

  it("throws an error if the value is not a valid string boolean", () => {
    window.sessionStorage.setItem("isSoleProprietor", "invalid");
    expect(() => getDefaultBoolean("isSoleProprietor")).toThrow(
      "Invalid boolean string value: isSoleProprietor, invalid",
    );
  });
});

describe("getBoolean", () => {
  it("returns the value in the data store as a boolean type", () => {
    window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
    expect(getBoolean("hasSameBillingMailingAddress", true)).toEqual(true);
    expect(getBoolean("hasSameBillingMailingAddress", false)).toEqual(true);

    window.sessionStorage.setItem("hasSameBillingMailingAddress", "false");
    expect(getBoolean("hasSameBillingMailingAddress", true)).toEqual(false);
    expect(getBoolean("hasSameBillingMailingAddress", false)).toEqual(false);
  });

  it("throws an error if required is true but the key is not present", () => {
    expect(() => getBoolean("hasSameBillingMailingAddress", true)).toThrow(
      "hasSameBillingMailingAddress is unexpectedly null",
    );
  });

  it("returns null if required is false and the key is not present", () => {
    expect(getBoolean("hasSameBillingMailingAddress", false)).toEqual(null);
  });

  it("throws an error if the value is not a valid boolean", () => {
    window.sessionStorage.setItem("hasSameBillingMailingAddress", "not a boolean");
    expect(() => getBoolean("hasSameBillingMailingAddress", true)).toThrow(
      "Invalid boolean value: hasSameBillingMailingAddress, not a boolean",
    );
    expect(() => getBoolean("hasSameBillingMailingAddress", false)).toThrow(
      "Invalid boolean value: hasSameBillingMailingAddress, not a boolean",
    );
  });
});

describe("getAddressState", () => {
  it("returns the value in the data store as an AddressState enum", () => {
    window.sessionStorage.setItem("state", "NJ");
    expect(getAddressState("state", true)).toEqual(AddressState.NJ);
    expect(getAddressState("state", false)).toEqual(AddressState.NJ);
  });

  it("throws an error if the value is not a valid AddressState", () => {
    window.sessionStorage.setItem("state", "not a state");
    expect(() => getAddressState("state", true)).toThrow(
      "Invalid AddressState value: state, not a state",
    );
    expect(() => getAddressState("state", false)).toThrow(
      "Invalid AddressState value: state, not a state",
    );
  });
});

describe("getBusinessAddressSameAsOtherAddress", () => {
  it.each([["mailing"], ["billing"], ["different"]])(
    "returns the value in the data store if the value is $1",
    (value) => {
      window.sessionStorage.setItem("businessAddressSameAsOtherAddress", value);
      expect(getBusinessAddressSameAsOtherAddress(true)).toEqual(value);
      expect(getBusinessAddressSameAsOtherAddress(false)).toEqual(value);
    },
  );

  it("returns an empty string if required is false and the key is not present", () => {
    expect(getBusinessAddressSameAsOtherAddress(false)).toEqual("");
  });

  it("throws an error if the value is not valid", () => {
    window.sessionStorage.setItem("businessAddressSameAsOtherAddress", "invalid");
    expect(() => getBusinessAddressSameAsOtherAddress(true)).toThrow(
      "Invalid value for businessAddressSameAsOtherAddress: invalid",
    );
    expect(() => getBusinessAddressSameAsOtherAddress(false)).toThrow(
      "Invalid value for businessAddressSameAsOtherAddress: invalid",
    );
  });
});
