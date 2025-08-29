import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import { render, screen } from "@testing-library/react";

describe("DoulaTextInput", () => {
  it("renders the input with a label", () => {
    const mockRegister = jest.fn();
    render(<DoulaTextInput name="testInput" label="Test label" register={mockRegister} />);

    expect(mockRegister).toHaveBeenCalledWith("testInput", undefined);
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("sets appropriate attributes when the input is required", () => {
    const mockRegister = jest.fn();
    const registerOptions = {
      required: "This field is required",
    };
    render(
      <DoulaTextInput
        name="testInput"
        label="Test label"
        required
        register={mockRegister}
        registerOptions={registerOptions}
      />,
    );

    expect(mockRegister).toHaveBeenCalledWith("testInput", registerOptions);
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAttribute("required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with a string hint", () => {
    render(
      <DoulaTextInput name="testInput" label="Test label" hint="Test hint" register={jest.fn()} />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Test hint");
  });

  it("shows an error message and sets appropriate attributes when there is an error for the input", () => {
    render(
      <DoulaTextInput
        name="testInput"
        label="Test label"
        required
        errors={{
          testInput: {
            type: "required",
            message: "This field is required",
          },
        }}
        register={jest.fn()}
        registerOptions={{
          required: "This field is required",
        }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription("This field is required");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not show an error message if there is no error for the input", () => {
    render(
      <DoulaTextInput<{ testInput: string; otherInput: string }>
        name="testInput"
        label="Test label"
        errors={{
          otherInput: {
            type: "required",
            message: "This other field is required",
          },
        }}
        register={jest.fn()}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with both the hint and the error message when both are present", () => {
    render(
      <DoulaTextInput
        name="testInput"
        label="Test label"
        hint="Test hint"
        required
        errors={{
          testInput: {
            type: "required",
            message: "This field is required",
          },
        }}
        register={jest.fn()}
        registerOptions={{
          required: "This field is required",
        }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription("This field is required Test hint");
  });
});
