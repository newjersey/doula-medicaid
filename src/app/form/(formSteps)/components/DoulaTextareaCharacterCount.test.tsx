import DoulaTextareaCharacterCount from "@/app/form/(formSteps)/components/DoulaTextareaCharacterCount";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

describe("DoulaTextareaCharacterCount", () => {
  it("renders the input with a label", () => {
    const mockRegister = jest.fn();
    render(
      <DoulaTextareaCharacterCount
        name="testInput"
        label="Test label"
        maxLength={10}
        register={mockRegister}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the input with a string hint", () => {
    render(
      <DoulaTextareaCharacterCount
        name="testInput"
        label="Test label"
        hint="Test hint"
        maxLength={10}
        register={jest.fn()}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Test hint");
  });

  it("describes the input with the provided describedby", () => {
    render(
      <>
        <DoulaTextareaCharacterCount
          name="testInput"
          label="Test label"
          aria-describedby="anotherDescriptonID"
          maxLength={10}
          register={jest.fn()}
        />
        <span id="anotherDescriptonID">Additional description</span>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(input).toHaveAccessibleDescription("Additional description");
  });

  it("sets appropriate attributes when the input is required", () => {
    const mockRegister = jest.fn();
    render(
      <DoulaTextareaCharacterCount
        name="testInput"
        label="Test label"
        required
        maxLength={10}
        register={mockRegister}
      />,
    );

    expect(mockRegister).toHaveBeenCalledWith(
      "testInput",
      expect.objectContaining({ required: "This question is required" }),
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAttribute("required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("shows an error message and sets appropriate attributes when there is an error for the input", () => {
    render(
      <DoulaTextareaCharacterCount
        name="testInput"
        label="Test label"
        required
        maxLength={10}
        errors={{
          testInput: {
            type: "required",
            message: "This field has a custom required error message",
          },
        }}
        register={jest.fn()}
        additionalRegisterOptions={{
          required: "This field has a custom required error message",
        }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label *" });
    expect(input).toHaveAccessibleDescription("This field has a custom required error message");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not show an error message if there is no error for the input", () => {
    render(
      <DoulaTextareaCharacterCount<{ testInput: string; otherInput: string }>
        name="testInput"
        label="Test label"
        maxLength={10}
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

  it("describes the input with the hint, the error message, and the aria-describedby when all are present", () => {
    render(
      <>
        <DoulaTextareaCharacterCount
          name="testInput"
          label="Test label"
          hint="Test hint"
          aria-describedby="anotherDescriptonID"
          required
          maxLength={10}
          errors={{
            testInput: {
              type: "required",
              message: "This field has a custom required error message",
            },
          }}
          register={jest.fn()}
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

  it("updates the character count as the input changes", async () => {
    // Not exhaustively testing this, because this is handles by the trussworks library component that we are using. Just making sure that the functionality still works.
    const user = userEvent.setup();
    render(
      <DoulaTextareaCharacterCount
        name="testInput"
        label="Test label"
        maxLength={5}
        register={jest.fn()}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Test label" });
    expect(screen.getByText("5 characters allowed")).toBeInTheDocument();
    await user.type(input, "12345");
    expect(screen.getByText("0 characters left")).toBeInTheDocument();
    await user.type(input, "6");
    expect(screen.getByText("1 character over limit")).toBeInTheDocument();
  });

  it("displays an error message if max length is exceeded", async () => {
    interface TestFormData {
      testInput: string;
    }

    const TestForm = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
      } = useForm<TestFormData>({
        defaultValues: {
          testInput: "",
        },
      });
      return (
        <DoulaForm<TestFormData>
          errors={errors}
          handleSubmit={handleSubmit}
          setFocus={setFocus}
          manualFocusOrder={["testInput"]}
          showErrorSummary={true}
        >
          <DoulaTextareaCharacterCount
            name="testInput"
            label="Test label"
            maxLength={10}
            errors={errors}
            register={register}
          />
          <FormProgressButtons />
        </DoulaForm>
      );
    };

    const user = userEvent.setup();
    renderWithProviders(<TestForm />, "/form/insurance/1");

    const input = screen.getByRole("textbox", { name: "Test label" });
    await user.type(input, "12345678901");

    expect(screen.getByText("1 character over limit")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(input).toHaveAccessibleDescription(
      "Character limit exceeded. Please edit and try again.",
    );
  });
});
