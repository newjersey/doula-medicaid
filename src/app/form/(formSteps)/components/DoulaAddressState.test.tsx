import { DoulaAddressState } from "@/app/form/(formSteps)/components/DoulaAddressState";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

describe("<DoulaAddressState />", () => {
  it("renders the input with a label", () => {
    const mockRegister = jest.fn();
    render(<DoulaAddressState name={"testState"} label={"State"} register={mockRegister} />);

    expect(mockRegister).toHaveBeenCalledWith("testState");
    const input = screen.getByRole("combobox", { name: "State *" });
    expect(input).toBeInTheDocument();
  });

  it("sets autocomplete if provided", () => {
    render(
      <DoulaAddressState
        name={"testState"}
        label={"State"}
        autocomplete={"shipping"}
        register={jest.fn()}
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
          <DoulaAddressState name={"testState"} label={"State"} register={register} />
          <FormProgressButtons />
        </DoulaForm>
      );
    };
    renderWithProviders(<TestForm />, "/form/personal/1");

    const input = await getInputField(screen, { name: "State *", role: "combobox" });
    expect(input).toHaveDisplayValue("New Jersey");
    expect(input).toHaveValue("NJ");
  });
});
