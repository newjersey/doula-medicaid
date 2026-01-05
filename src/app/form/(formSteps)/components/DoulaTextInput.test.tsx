import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

describe("DoulaTextInput", () => {
  it("renders the input with a label", () => {
    const mockRegister = vi.fn();
    render(<DoulaTextInput name="testInput" label="Test label" register={mockRegister} />);

    expect(mockRegister).toHaveBeenCalledWith("testInput", {});
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with a string hint", () => {
    render(
      <DoulaTextInput name="testInput" label="Test label" hint="Test hint" register={vi.fn()} />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Test hint");
  });

  it("describes the input with the provided describedby", () => {
    render(
      <>
        <DoulaTextInput
          name="testInput"
          label="Test label"
          aria-describedby="anotherDescriptonID"
          register={vi.fn()}
        />
        <span id="anotherDescriptonID">Additional description</span>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Additional description");
  });

  it("includes both the input and provided input prefix", () => {
    render(
      <DoulaTextInput name="testInput" label="Test label" inputPrefix="$" register={vi.fn()} />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toBeInTheDocument();
    const inputPrefix = screen.getByText("$", { exact: false });
    expect(inputPrefix).toAppearBefore(input);
  });

  it("sets appropriate attributes when the input is required", () => {
    const mockRegister = vi.fn();
    render(<DoulaTextInput name="testInput" label="Test label" required register={mockRegister} />);

    expect(mockRegister).toHaveBeenCalledWith("testInput", { required: "Test label is required" });
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAttribute("required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("only allows numeric inputs when numericOnly is set", async () => {
    interface TestFormData {
      testInput: string;
    }
    const TestForm = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<TestFormData>({
        defaultValues: {
          testInput: "",
        },
      });
      return (
        <DoulaForm<TestFormData>
          errors={errors}
          handleSubmit={handleSubmit}
          showErrorSummary={false}
        >
          <DoulaTextInput name="testInput" label="Test label" numericOnly register={register} />
        </DoulaForm>
      );
    };

    const user = userEvent.setup();
    renderWithProviders(<TestForm />, "/form/personal/1");

    const input = screen.getByRole("textbox", { name: "Test label" });
    await user.type(input, "aaa");
    expect(input).toHaveValue("");
    await user.type(input, "!!");
    expect(input).toHaveValue("");
    await user.type(input, "11");
    expect(input).toHaveValue("11");
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
      <DoulaTextInput
        name="testInput"
        label="Test label"
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
        <DoulaTextInput
          name="testInput"
          label="Test label"
          hint="Test hint"
          aria-describedby="anotherDescriptonID"
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
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
