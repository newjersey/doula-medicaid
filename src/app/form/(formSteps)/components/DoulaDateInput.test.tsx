import {
  DoulaDateInput,
  type DoulaDateInputProps,
} from "@/app/form/(formSteps)/components/DoulaDateInput";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { fillField, getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

interface TestFormData {
  testMonth: string;
  testDay: string;
  testYear: string;
}
const TestForm = (props: Omit<DoulaDateInputProps<TestFormData>, "errors" | "register">) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<TestFormData>({
    defaultValues: {
      testMonth: "",
      testDay: "",
      testYear: "",
    },
  });
  return (
    <DoulaForm<TestFormData>
      manualFocusOrder={["testMonth", "testDay", "testYear"]}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      showErrorSummary={true}
    >
      <DoulaDateInput {...props} errors={errors} register={register} />
      <FormProgressButtons />
    </DoulaForm>
  );
};

describe("<DoulaDateInput />", () => {
  it("renders month, day, and year", async () => {
    render(
      <DoulaDateInput
        name="dateOfBirth"
        label="Date of birth"
        hint="For example: April 28 1986"
        monthName="dateOfBirthMonth"
        dayName="dateOfBirthDay"
        yearName="dateOfBirthYear"
        errors={{}}
        register={vi.fn()}
      />,
    );

    const monthInput = await getInputField(screen, {
      name: "Month *",
      role: "combobox",
      withinGroupName: "Date of birth * For example: April 28 1986",
    });
    const dayInput = await getInputField(screen, {
      name: "Day *",
      withinGroupName: "Date of birth * For example: April 28 1986",
    });
    const yearInput = await getInputField(screen, {
      name: "Year *",
      withinGroupName: "Date of birth * For example: April 28 1986",
    });

    for (const input of [monthInput, dayInput, yearInput]) {
      expect(input).toBeRequired();
    }
  });

  it.each([
    { invalidTestValue: "test", expectedErrorMessage: "Day must be a number" },
    { invalidTestValue: "0", expectedErrorMessage: "Day must be between 1 and 31" },
    { invalidTestValue: "50", expectedErrorMessage: "Day must be between 1 and 31" },
  ])(
    "displays an error message if day is the invalid format %s",
    async ({ invalidTestValue, expectedErrorMessage }) => {
      const user = userEvent.setup();
      renderWithProviders(
        <TestForm
          name="test"
          label="Test date input"
          hint="For example: April 28 2030"
          monthName="testMonth"
          dayName="testDay"
          yearName="testYear"
        />,
        "/form/personal/2",
      );
      await fillField(screen, user, {
        name: "Month *",
        role: "combobox",
        testValue: "February",
      });
      await fillField(screen, user, {
        name: "Year *",
        testValue: "2025",
      });
      const dayInput = await getInputField(screen, { name: "Day *" });
      await user.type(dayInput, invalidTestValue);
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(dayInput).toHaveAccessibleDescription(expectedErrorMessage);
    },
  );

  it.each([
    { invalidTestValue: "test", expectedErrorMessage: "Year must be a number" },
    { invalidTestValue: "1", expectedErrorMessage: "Year must have four digits" },
  ])(
    "displays an error message if year is the invalid format %s",
    async ({ invalidTestValue, expectedErrorMessage }) => {
      const user = userEvent.setup();
      renderWithProviders(
        <TestForm
          name="test"
          label="Test date input"
          hint="For example: April 28 2030"
          monthName="testMonth"
          dayName="testDay"
          yearName="testYear"
        />,
        "/form/personal/2",
      );
      await fillField(screen, user, {
        name: "Month *",
        role: "combobox",
        testValue: "February",
      });
      await fillField(screen, user, {
        name: "Day *",
        testValue: "05",
      });
      const dayInput = await getInputField(screen, { name: "Year *" });
      await user.type(dayInput, invalidTestValue);
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(dayInput).toHaveAccessibleDescription(expectedErrorMessage);
    },
  );

  it("displays error messages that includes a prefix if provided", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestForm
        name="test"
        label="Test date input"
        hint="For example: April 28 2030"
        monthName="testMonth"
        dayName="testDay"
        yearName="testYear"
        errorLabelPrefix="Test"
      />,
      "/form/personal/2",
    );
    const monthInput = await getInputField(screen, {
      name: "Month *",
      role: "combobox",
    });
    const dayInput = await getInputField(screen, {
      name: "Day *",
    });
    const yearInput = await getInputField(screen, {
      name: "Year *",
    });
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const testCase of [
      { input: monthInput, expectedErrorMessage: "Test month is required" },
      { input: dayInput, expectedErrorMessage: "Test day is required" },
      { input: yearInput, expectedErrorMessage: "Test year is required" },
    ]) {
      expect(testCase.input).toHaveAccessibleDescription(testCase.expectedErrorMessage);
    }
  });
});
