import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { render, screen } from "@testing-library/react";

describe("DoulaTextInputMask", () => {
  it("renders the input with a label", () => {
    const mockRegister = vi.fn();
    render(
      <DoulaTextInputMask
        name="testInput"
        label="Test label"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        register={mockRegister}
      />,
    );

    expect(mockRegister).toHaveBeenCalledWith("testInput", {});
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("sets appropriate attributes when the input is required", () => {
    const mockRegister = vi.fn();
    render(
      <DoulaTextInputMask
        name="testInput"
        label="Test label"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        required
        register={mockRegister}
      />,
    );
    expect(mockRegister).toHaveBeenCalledWith("testInput", { required: "Test label is required" });
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAttribute("required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with a string hint", () => {
    render(
      <DoulaTextInputMask
        name="testInput"
        label="Test label"
        hint="Test hint"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        register={vi.fn()}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Test hint");
  });

  it("it describes the input with the provided describedby", () => {
    render(
      <>
        <DoulaTextInputMask
          name="testInput"
          label="Test label"
          aria-describedby="anotherDescriptonID"
          inputMode="numeric"
          mask="___-___-____"
          pattern="\d{3}-\d{3}-\d{4}"
          register={vi.fn()}
        />
        <span id="anotherDescriptonID">Additional description</span>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Additional description");
  });

  it("shows an error message and sets appropriate attributes when there is an error for the input", () => {
    render(
      <DoulaTextInputMask
        name="testInput"
        label="Test label"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        required
        errors={{
          testInput: {
            type: "required",
            message: "This field has a custom required error message",
          },
        }}
        register={vi.fn()}
        additionalRegisterOptions={{
          required: "This field has a custom required error message",
        }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription("This field has a custom required error message");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a jsx error message if provided", async () => {
    render(
      <DoulaTextInputMask
        name="testInput"
        label="Test label"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        required
        errors={{
          testInput: {
            type: "required",
            message: "This field has a custom required error message",
          },
        }}
        register={vi.fn()}
        additionalRegisterOptions={{
          required: "This field has a custom required error message",
        }}
        jsxErrorMessage={[
          {
            type: "required",
            message: (
              <div>
                Fancy error <span>message</span>
              </div>
            ),
          },
        ]}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription("Fancy error message");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("it does not show an error message if there is no error for the input", () => {
    render(
      <DoulaTextInputMask<{ testInput: string; otherInput: string }>
        name="testInput"
        label="Test label"
        inputMode="numeric"
        mask="___-___-____"
        pattern="\d{3}-\d{3}-\d{4}"
        errors={{
          otherInput: {
            type: "required",
            message: "This other field is required",
          },
        }}
        register={vi.fn()}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with the hint, the error message, and the aria-describedby when all are present", () => {
    render(
      <>
        <DoulaTextInputMask
          name="testInput"
          label="Test label"
          hint="Test hint"
          aria-describedby="anotherDescriptonID"
          inputMode="numeric"
          mask="___-___-____"
          pattern="\d{3}-\d{3}-\d{4}"
          required
          errors={{
            testInput: {
              type: "required",
              message: "This field has a custom required error message",
            },
          }}
          register={vi.fn()}
          additionalRegisterOptions={{
            required: "This field has a custom required error message",
          }}
        />
        <span id="anotherDescriptonID">Additional description</span>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription(
      "This field has a custom required error message Test hint Additional description",
    );
  });
});
