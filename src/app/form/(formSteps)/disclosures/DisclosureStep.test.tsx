import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getValue } from "../../_utils/sessionStorage";
import DisclosuresStep from "./page";

describe("<DisclosuresStep />", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saves natureOfDisclosingEntity as null when user selects no", async () => {
    const user = userEvent.setup();
    render(<DisclosuresStep />);
    const noButton = screen.getByRole("radio", {
      name: "No, my doula business is not a sole proprietorship",
    });
    const yesButton = screen.getByRole("radio", {
      name: "Yes, my doula business is a sole proprietorship",
    });
    await user.click(yesButton);
    expect(getValue("natureOfDisclosingEntity")).toBe("SoleProprietorship");
    await user.click(noButton);
    expect(noButton).toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe(null);
  });

  it("saves natureOfDisclosingEntity as SoleProprietorship when user selects yes", async () => {
    const user = userEvent.setup();
    render(<DisclosuresStep />);
    const noButton = screen.getByRole("radio", {
      name: "No, my doula business is not a sole proprietorship",
    });
    const yesButton = screen.getByRole("radio", {
      name: "Yes, my doula business is a sole proprietorship",
    });
    expect(yesButton).not.toBeChecked();
    expect(noButton).not.toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe(null);
    await user.click(yesButton);
    expect(yesButton).toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe("SoleProprietorship");
  });
});
