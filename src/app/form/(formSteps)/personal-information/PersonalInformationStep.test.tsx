import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalInformationStep from "./page";

describe("<PersonalInformationStep />", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it.each([
    { name: "First name", key: "firstName", testValue: "Test first name" },
    { name: "Middle name (optional)", key: "middleName", testValue: "Test middle name" },
    { name: "Last name", key: "lastName", testValue: "Test last name" },
    { name: "Date of birth", key: "dateOfBirth", testValue: "01/01/1990" },
    { name: "Email address", key: "email", testValue: "test@test.com" },
    { name: "NPI number", key: "npiNumber", testValue: "2222222222" },
    { name: "Street address 1", key: "streetAddress1", testValue: "Test address 1" },
    { name: "Street address 2 (optional)", key: "streetAddress2", testValue: "Test address 2" },
    { name: "City", key: "city", testValue: "Test city" },
    { name: "ZIP code", key: "zip", testValue: "12345" },
  ])("updates the $name text input", async ({ name, key, testValue }) => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(window.sessionStorage.getItem(key)).toEqual(null);

    await user.type(inputField, testValue);

    expect(inputField).toHaveValue(testValue);
    expect(window.sessionStorage.getItem(key)).toEqual(testValue);
  });

  it("updates phone number", async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);
    const inputField = screen.getByRole("textbox", {
      name: "Phone number",
    });
    expect(window.sessionStorage.getItem("phoneNumber")).toEqual(null);

    await user.type(inputField, "1111111111");

    expect(inputField).toHaveValue("111-111-1111");
    expect(window.sessionStorage.getItem("phoneNumber")).toEqual("111-111-1111");
  });

  it("updates address state", async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);
    const combobox = screen.getByRole("combobox", {
      name: "State",
    });
    expect(combobox).toHaveValue("NJ");
    expect(window.sessionStorage.getItem("state")).toEqual("NJ");

    await user.selectOptions(combobox, "PA");

    expect(combobox).toHaveValue("PA");
    expect(window.sessionStorage.getItem("state")).toEqual("PA");
  });
});
