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
    const dataStore = { firstName: "test name" };
    expect(getValue(dataStore, "firstName", true)).toEqual("test name");
    expect(getValue(dataStore, "firstName", false)).toEqual("test name");
  });

  it("throws an error if required is true but the key is not present", () => {
    expect(() => getValue({}, "firstName", true)).toThrow("firstName is unexpectedly null");
  });

  it("returns null if required is false and the key is not present", () => {
    expect(getValue({}, "firstName", false)).toEqual(null);
  });
});

describe("getDefaultBooleanString", () => {
  it("returns an empty string if the value is not in the data store", () => {
    expect(getDefaultBoolean({}, "isSoleProprietor")).toEqual("");
  });

  it("returns the value in the data store as a true or false string", () => {
    expect(getDefaultBoolean({ isSoleProprietor: "true" }, "isSoleProprietor")).toEqual("true");
    expect(getDefaultBoolean({ isSoleProprietor: "false" }, "isSoleProprietor")).toEqual("false");
  });

  it("throws an error if the value is not a valid string boolean", () => {
    expect(() => getDefaultBoolean({ isSoleProprietor: "invalid" }, "isSoleProprietor")).toThrow(
      "Invalid boolean string value: isSoleProprietor, invalid",
    );
  });
});

describe("getBoolean", () => {
  it("returns the value in the data store as a boolean type", () => {
    const dataStoreTrue = { hasSameBillingMailingAddress: "true" };
    expect(getBoolean(dataStoreTrue, "hasSameBillingMailingAddress", true)).toEqual(true);
    expect(getBoolean(dataStoreTrue, "hasSameBillingMailingAddress", false)).toEqual(true);

    const dataStoreFalse = { hasSameBillingMailingAddress: "false" };
    expect(getBoolean(dataStoreFalse, "hasSameBillingMailingAddress", true)).toEqual(false);
    expect(getBoolean(dataStoreFalse, "hasSameBillingMailingAddress", false)).toEqual(false);
  });

  it("throws an error if required is true but the key is not present", () => {
    expect(() => getBoolean({}, "hasSameBillingMailingAddress", true)).toThrow(
      "hasSameBillingMailingAddress is unexpectedly null",
    );
  });

  it("returns null if required is false and the key is not present", () => {
    expect(getBoolean({}, "hasSameBillingMailingAddress", false)).toEqual(null);
  });

  it("throws an error if the value is not a valid boolean", () => {
    const dataStore = { hasSameBillingMailingAddress: "not a boolean" };
    expect(() => getBoolean(dataStore, "hasSameBillingMailingAddress", true)).toThrow(
      "Invalid boolean value: hasSameBillingMailingAddress, not a boolean",
    );
    expect(() => getBoolean(dataStore, "hasSameBillingMailingAddress", false)).toThrow(
      "Invalid boolean value: hasSameBillingMailingAddress, not a boolean",
    );
  });
});

describe("getAddressState", () => {
  it("returns the value in the data store as an AddressState enum", () => {
    const dataStore = { state: "NJ" };
    expect(getAddressState(dataStore, "state", true)).toEqual(AddressState.NJ);
    expect(getAddressState(dataStore, "state", false)).toEqual(AddressState.NJ);
  });

  it("throws an error if the value is not a valid AddressState", () => {
    const dataStore = { state: "not a state" };
    expect(() => getAddressState(dataStore, "state", true)).toThrow(
      "Invalid AddressState value: state, not a state",
    );
    expect(() => getAddressState(dataStore, "state", false)).toThrow(
      "Invalid AddressState value: state, not a state",
    );
  });
});

describe("getBusinessAddressSameAsOtherAddress", () => {
  it.each([["mailing"], ["billing"], ["different"]])(
    "returns the value in the data store if the value is $1",
    (value) => {
      const dataStore = { businessAddressSameAsOtherAddress: value };
      expect(getBusinessAddressSameAsOtherAddress(dataStore, true)).toEqual(value);
      expect(getBusinessAddressSameAsOtherAddress(dataStore, false)).toEqual(value);
    },
  );

  it("returns an empty string if required is false and the key is not present", () => {
    expect(getBusinessAddressSameAsOtherAddress({}, false)).toEqual("");
  });

  it("throws an error if the value is not valid", () => {
    const dataStore = { businessAddressSameAsOtherAddress: "invalid" };
    expect(() => getBusinessAddressSameAsOtherAddress(dataStore, true)).toThrow(
      "Invalid value for businessAddressSameAsOtherAddress: invalid",
    );
    expect(() => getBusinessAddressSameAsOtherAddress(dataStore, false)).toThrow(
      "Invalid value for businessAddressSameAsOtherAddress: invalid",
    );
  });
});
