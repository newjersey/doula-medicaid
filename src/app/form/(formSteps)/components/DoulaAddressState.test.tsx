import { DoulaAddressState } from "@/app/form/(formSteps)/components/DoulaAddressState";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

describe("<DoulaAddressState />", () => {
  it("renders the input with a label", () => {
    const mockRegister = vi.fn();
    render(
      <DoulaAddressState name={"testState"} label={"State"} errors={{}} register={mockRegister} />,
    );

    expect(mockRegister).toHaveBeenCalledWith("testState", { required: "State is required" });
    const input = screen.getByRole("combobox", { name: "State *" });
    expect(input).toBeInTheDocument();
  });

  it("sets appropriate attributes when the input is required", () => {
    const mockRegister = vi.fn();
    render(
      <DoulaAddressState name="testState" label="State" errors={{}} register={mockRegister} />,
    );

    expect(mockRegister).toHaveBeenCalledWith("testState", { required: "State is required" });
    const input = screen.getByRole("combobox", { name: "State *" });
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("aria-describedby", "");
  });

  it("shows an error message and sets appropriate attributes when there is an error for the input", () => {
    render(
      <DoulaAddressState
        name="testState"
        label="State"
        errors={{
          testState: {
            type: "required",
            message: "State is required",
          },
        }}
        register={vi.fn()}
      />,
    );
    const input = screen.getByRole("combobox", { name: "State *" });
    expect(input).toHaveAccessibleDescription("State is required");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("sets autocomplete if provided", () => {
    render(
      <DoulaAddressState
        name={"testState"}
        label={"State"}
        autocomplete={"shipping"}
        errors={{}}
        register={vi.fn()}
      />,
    );
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveAttribute(
      "autocomplete",
      "shipping address-level1",
    );
  });

  it("is able to default to NJ", async () => {
    interface TestFormData {
      testState: string;
    }
    const TestForm = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<TestFormData>({
        defaultValues: {
          testState: "NJ",
        },
      });
      return (
        <DoulaForm<TestFormData>
          errors={errors}
          handleSubmit={handleSubmit}
          showErrorSummary={false}
        >
          <DoulaAddressState
            name={"testState"}
            label={"State"}
            errors={errors}
            register={register}
          />
          <FormProgressButtons />
        </DoulaForm>
      );
    };
    renderWithProviders(<TestForm />, "/form/personal/1");

    const input = await getInputField(screen, { name: "State *", role: "combobox" });
    expect(input).toHaveDisplayValue("New Jersey");
    expect(input).toHaveValue("NJ");
  });

  it("displays error messages that includes a prefix if provided", async () => {
    interface TestFormData {
      testState: string;
    }
    const TestForm = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<TestFormData>({
        defaultValues: {
          testState: "",
        },
      });
      return (
        <DoulaForm<TestFormData>
          errors={errors}
          handleSubmit={handleSubmit}
          showErrorSummary={false}
        >
          <DoulaAddressState
            name={"testState"}
            label={"State"}
            errorLabelPrefix="Bank"
            errors={errors}
            register={register}
          />
          <FormProgressButtons />
        </DoulaForm>
      );
    };
    const user = userEvent.setup();
    renderWithProviders(<TestForm />, "/form/personal/1");

    const input = await getInputField(screen, { name: "State *", role: "combobox" });
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(input).toHaveAccessibleDescription("Bank state is required");
  });
});
