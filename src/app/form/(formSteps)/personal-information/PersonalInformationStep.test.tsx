import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonalInformationStep from "./page";

describe("<PersonalInformationStep />", () => {
  it("updates first name", async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);

    const firstNameInput = screen.getByRole("textbox", {
      name: "First name",
    });
    await user.type(firstNameInput, "Test first name");

    expect(firstNameInput).toHaveValue("Test first name");
  });
});
