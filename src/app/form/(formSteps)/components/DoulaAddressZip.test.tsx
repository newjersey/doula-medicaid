import { DoulaAddressZip } from "@/app/form/(formSteps)/components/DoulaAddressZip";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

interface TestFormData {
  testZip: string;
}
const TestForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TestFormData>({
    defaultValues: {
      testZip: "NJ",
    },
  });
  const testZip = watch("testZip");
  return (
    <DoulaForm<TestFormData> errors={errors} handleSubmit={handleSubmit} showErrorSummary={false}>
      <DoulaAddressZip
        name={"testZip"}
        label={"ZIP Code"}
        value={testZip}
        errors={errors}
        register={register}
      />
      <FormProgressButtons />
    </DoulaForm>
  );
};

describe("<DoulaAddressZip />", () => {
  it("sets autocomplete if provided", () => {
    render(
      <DoulaAddressZip
        name={"testZip"}
        label={"ZIP Code"}
        value={""}
        autocomplete={"shipping"}
        errors={{}}
        register={jest.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "ZIP Code *" })).toHaveAttribute(
      "autocomplete",
      "shipping postal-code",
    );
  });

  it("displays an error message if zip has fewer than five digits", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestForm />, "/form/personal/1");
    const zipInput = await getInputField(screen, { name: "ZIP Code *" });
    await user.type(zipInput, "1");
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(zipInput).toHaveAccessibleDescription("ZIP Code must have five digits");
  });

  it("prevents non-numeric inputs in ZIP Code", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestForm />, "/form/personal/1");
    const zipInput = await getInputField(screen, { name: "ZIP Code *" });
    await user.type(zipInput, "aaa");
    expect(zipInput).toHaveValue("");
    await user.type(zipInput, "!!");
    expect(zipInput).toHaveValue("");
    await user.type(zipInput, "11");
    expect(zipInput).toHaveValue("11");
  });
});
