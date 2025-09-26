import {
  DoulaAddress,
  type DoulaAddressProps,
} from "@/app/form/(formSteps)/components/DoulaAddress";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { fillAllInputsExcept, getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/renderWithRouter";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

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
  testZip: "ZIP code",
};

const allInputFields = [
  {
    name: "Street address *",
    sessionStorageKey: "testStreetAddress1",
    role: "textbox" as const,
    testValue: "55 Cherry St",
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "testStreetAddress2",
    role: "textbox" as const,
    testValue: "Apt 4",
  },
  { name: "City *", sessionStorageKey: "testCity", role: "textbox" as const, testValue: "Newark" },
  { name: "State *", sessionStorageKey: "testState", role: "combobox" as const, testValue: "PA" },
  {
    name: "ZIP code *",
    sessionStorageKey: "testZip",
    role: "textbox" as const,
    testValue: "08609",
  },
];

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
    <RouterPathnameProvider pathname="/form/personal-details/2">
      <DoulaForm<TestFormData>
        orderedInputNameToLabel={testFormOrderedInputNameToLabel}
        errors={errors}
        setFocus={setFocus}
        handleSubmit={handleSubmit}
        mayHaveThreeOrMoreErrors={true}
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
    </RouterPathnameProvider>
  );
};

describe("DoulaAddress", () => {
  it("renders all expected address inputs", async () => {
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
          testZip: "ZIP code",
        }}
        errors={{}}
        register={jest.fn()}
      />,
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
      name: "ZIP code *",
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
          testZip: "ZIP code",
        }}
        autocomplete="shipping"
        errors={{}}
        register={jest.fn()}
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
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveAttribute(
      "autocomplete",
      "shipping postal-code",
    );
  });

  it("displays an error message if zip has fewer than five digits", async () => {
    const user = userEvent.setup();
    render(
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
      />,
    );
    await fillAllInputsExcept(screen, user, allInputFields, new Set(["testZip"]));
    const zipInput = await getInputField(screen, { name: "ZIP code *" });
    await user.type(zipInput, "1");
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(zipInput).toHaveAccessibleDescription("ZIP code must have five digits");
  });

  it("displays error messages that includes a prefix if provided", async () => {
    const user = userEvent.setup();
    render(
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
    );
    const streetAddress1Input = await getInputField(screen, {
      name: "Street address *",
    });
    const cityInput = await getInputField(screen, {
      name: "City *",
    });
    const zipInput = await getInputField(screen, {
      name: "ZIP code *",
    });
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const testCase of [
      { input: streetAddress1Input, expectedErrorMessage: "Test street address is required" },
      { input: cityInput, expectedErrorMessage: "Test city is required" },
      { input: zipInput, expectedErrorMessage: "Test zip code is required" },
    ]) {
      expect(testCase.input).toHaveAccessibleDescription(testCase.expectedErrorMessage);
    }

    await user.type(zipInput, "1");
    expect(zipInput).toHaveAccessibleDescription("Test zip code must have five digits");
  });
});
