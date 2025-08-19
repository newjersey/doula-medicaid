import { AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

describe("getValue", () => {
  it("returns the value in session storage", () => {
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

describe("getBoolean", () => {
  it("returns the value in session storage as a boolean type", () => {
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
  it("returns the value in session storage as an AddressState enum", () => {
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
