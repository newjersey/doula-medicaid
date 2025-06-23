import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalInformationStep from "./page";

async function checkTextField(fieldName: string, expectedValue: string) {
  const user = userEvent.setup();
  render(<PersonalInformationStep />);
  const inputField = screen.getByRole("textbox", {
    name: fieldName,
  });

  await user.type(inputField, expectedValue);

  expect(inputField).toHaveValue(expectedValue);
}

describe("<PersonalInformationStep />", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("updates first name", async () => {
    await checkTextField("First name", "Test first name");
  });

  it("updates middle name", async () => {
    await checkTextField("Middle name (optional)", "Test middle name");
  });

  it("updates last name", async () => {
    await checkTextField("Last name", "Test last name");
  });

  it("updates street address 1", async () => {
    await checkTextField("Street address 1", "Test address 1");
  });

  it("updates street address 2", async () => {
    await checkTextField("Street address 2 (optional)", "Test address 2");
  });

  it("updates city", async () => {
    await checkTextField("City", "Test city");
  });

  it("updates zip code", async () => {
    await checkTextField("ZIP", "12345");
  });
});
