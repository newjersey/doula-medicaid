import {
  DoulaAddress,
  type DoulaAddressProps,
} from "@/app/form/(formSteps)/components/DoulaAddress";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, type FieldPath } from "react-hook-form";

interface TestFormData {
  testStreetAddress1: string;
  testStreetAddress2: string;
  testCity: string;
  testState: string;
  testZip: string;
}
const testFormOrderedInputNameToLabel = {
  testStreetAddress1: "Street address",
  testStreetAddress2: "Street address line 2",
  testCity: "City",
  testState: "State",
  testZip: "ZIP Code",
};

const TestForm = (
  props: Omit<
    DoulaAddressProps<TestFormData>,
    "zipValue" | "orderedInputNameToLabel" | "errors" | "register"
  >,
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<TestFormData>({
    defaultValues: {
      testStreetAddress1: "",
      testStreetAddress2: "",
      testCity: "",
      testState: "NJ",
      testZip: "",
    },
  });
  const testZip = watch("testZip");
  return (
    <DoulaForm<TestFormData>
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      manualFocusOrder={
        Object.keys(testFormOrderedInputNameToLabel) as Array<FieldPath<TestFormData>>
      }
      showErrorSummary={true}
    >
      <DoulaAddress
        {...props}
        zipValue={testZip}
        orderedInputNameToLabel={testFormOrderedInputNameToLabel}
        errors={errors}
        register={register}
      />
      <FormProgressButtons />
    </DoulaForm>
  );
};

describe("DoulaAddress", () => {
  it("renders all expected address inputs", async () => {
    renderWithProviders(
      <DoulaAddress
        fieldsetProps={{
          legend: "What is your address?",
        }}
        addressKeys={{
          streetAddress1: "testStreetAddress1",
          streetAddress2: "testStreetAddress2",
          city: "testCity",
          state: "testState",
          zip: "testZip",
        }}
        zipValue={"11111"}
        orderedInputNameToLabel={{
          testStreetAddress1: "Street address",
          testStreetAddress2: "Street address line 2",
          testCity: "City",
          testState: "State",
          testZip: "ZIP Code",
        }}
        errors={{}}
        register={vi.fn()}
      />,
      "/form/personal/2",
    );
    const streetAddress1Input = await getInputField(screen, {
      name: "Street address *",
      withinGroupName: "What is your address?",
    });
    const streetAddress2Input = await getInputField(screen, {
      name: "Street address line 2",
      withinGroupName: "What is your address?",
    });
    const cityInput = await getInputField(screen, {
      name: "City *",
      withinGroupName: "What is your address?",
    });
    const stateInput = await getInputField(screen, {
      name: "State *",
      role: "combobox",
      withinGroupName: "What is your address?",
    });
    const zipInput = await getInputField(screen, {
      name: "ZIP Code *",
      withinGroupName: "What is your address?",
    });

    for (const input of [streetAddress1Input, cityInput, stateInput, zipInput]) {
      expect(input).toBeRequired();
    }
    expect(streetAddress2Input).not.toBeRequired();
  });

  it("sets autocomplete if provided", () => {
    render(
      <DoulaAddress
        fieldsetProps={{
          legend: "What is your address?",
        }}
        addressKeys={{
          streetAddress1: "testStreetAddress1",
          streetAddress2: "testStreetAddress2",
          city: "testCity",
          state: "testState",
          zip: "testZip",
        }}
        zipValue={"11111"}
        orderedInputNameToLabel={{
          testStreetAddress1: "Street address",
          testStreetAddress2: "Street address line 2",
          testCity: "City",
          testState: "State",
          testZip: "ZIP Code",
        }}
        autocomplete="shipping"
        errors={{}}
        register={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Street address *" })).toHaveAttribute(
      "autocomplete",
      "shipping address-line1",
    );
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveAttribute(
      "autocomplete",
      "shipping address-line2",
    );
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveAttribute(
      "autocomplete",
      "shipping address-level2",
    );
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveAttribute(
      "autocomplete",
      "shipping address-level1",
    );
    expect(screen.getByRole("textbox", { name: "ZIP Code *" })).toHaveAttribute(
      "autocomplete",
      "shipping postal-code",
    );
  });

  it("displays error messages that includes a prefix if provided", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestForm
        fieldsetProps={{
          legend: "What is your address?",
        }}
        addressKeys={{
          streetAddress1: "testStreetAddress1",
          streetAddress2: "testStreetAddress2",
          city: "testCity",
          state: "testState",
          zip: "testZip",
        }}
        errorLabelPrefix="Test"
      />,
      "/form/personal/2",
    );
    const streetAddress1Input = await getInputField(screen, {
      name: "Street address *",
    });
    const cityInput = await getInputField(screen, {
      name: "City *",
    });
    const zipInput = await getInputField(screen, {
      name: "ZIP Code *",
    });
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const testCase of [
      { input: streetAddress1Input, expectedErrorMessage: "Test street address is required" },
      { input: cityInput, expectedErrorMessage: "Test city is required" },
      { input: zipInput, expectedErrorMessage: "Test ZIP Code is required" },
    ]) {
      expect(testCase.input).toHaveAccessibleDescription(testCase.expectedErrorMessage);
    }

    await user.type(zipInput, "1");
    expect(zipInput).toHaveAccessibleDescription("Test ZIP Code must have five digits");
  });
});
