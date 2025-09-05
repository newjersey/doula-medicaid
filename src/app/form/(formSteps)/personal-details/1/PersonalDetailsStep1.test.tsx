import {
  fillAllInputsExcept,
  getInputField,
  type InputField,
} from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import PersonalDetailsStep1 from "@form/(formSteps)/personal-details/1/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const personalIdentificationFields = [
  { name: "First name *", key: "firstName", testValue: "Test first name" },
  { name: "Middle name", key: "middleName", testValue: "Test middle name" },
  { name: "Last name *", key: "lastName", testValue: "Test last name" },
  { name: "Day *", key: "dateOfBirthDay", testValue: "6" },
  { name: "Year *", key: "dateOfBirthYear", testValue: "1988" },
  {
    name: "Social security number *",
    key: "socialSecurityNumber",
    testValue: "123456789",
    expectedValue: "123-45-6789",
  },
];

const contactInformationFields = [
  { name: "Email address *", key: "email", testValue: "test@test.com" },
  {
    name: "Phone number *",
    key: "phoneNumber",
    testValue: "3211234567",
    expectedValue: "321-123-4567",
  },
];
const textInputFields = [...personalIdentificationFields, ...contactInformationFields];

const allInputFields: Array<InputField> = [
  ...textInputFields,
  { name: "Month *", role: "combobox", key: "dateOfBirthMonth", testValue: "07 - July" },
];

const requiredKeys = [
  "firstName",
  "lastName",
  "dateOfBirthMonth",
  "dateOfBirthDay",
  "dateOfBirthYear",
  "phoneNumber",
  "email",
  "socialSecurityNumber",
];

const requiredPersonalIdentificationFields: Array<InputField> = personalIdentificationFields.filter(
  (field) => requiredKeys.includes(field.key),
);

const requiredContactInformationFields: Array<InputField> = contactInformationFields.filter(
  (field) => requiredKeys.includes(field.key),
);

describe("<PersonalDetailsStep1 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/1"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("personal identification fields", () => {
    it.each(personalIdentificationFields)(
      "updates the $name text input",
      async ({ name, testValue, expectedValue }) => {
        const user = userEvent.setup();
        renderWithRouter();
        const input = screen.getByRole("textbox", {
          name: name,
        });
        expect(input).toHaveValue("");

        await user.type(input, testValue);
        expect(input).toHaveValue(expectedValue ?? testValue);
      },
    );

    it("updates the date of birth month", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const combobox = screen.getByRole("combobox", {
        name: "Month *",
      });
      await user.selectOptions(combobox, "07 - July");
      expect(combobox).toHaveValue("7");
    });

    it("saves form data on submit", async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allInputFields, new Set());
      await user.click(screen.getByRole("button", { name: "Next" }));

      for (const field of personalIdentificationFields) {
        expect(window.sessionStorage.getItem(field.key)).toEqual(
          field.expectedValue ?? field.testValue,
        );
      }

      expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/2");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it("validates date of birth day", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "Day *",
      });

      await user.type(input, "test");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(expect.stringContaining("Day must be a number"));
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "0");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Day must be between 1 and 31`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "50");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Day must be between 1 and 31`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("validates date of birth year", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "Year *",
      });

      await user.type(input, "test");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(expect.stringContaining("Year must be a number"));
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "1");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("Year must have four digits"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it.each(requiredPersonalIdentificationFields)(
      "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
      async ({ name, key }) => {
        const user = userEvent.setup();
        renderWithRouter();

        const labelWithoutAsterisk = name.replace(" *", "");
        const input = await getInputField(screen, { name });
        expect(input).toBeRequired();
        await fillAllInputsExcept(screen, user, allInputFields, new Set([key]));
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining(`${labelWithoutAsterisk} is required`),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveFocus();
      },
    );

    it.each(personalIdentificationFields)(
      "fills $name from session storage when page is loadad",
      async ({ name, key, testValue }) => {
        window.sessionStorage.setItem(key, testValue);
        renderWithRouter();
        expect(screen.getByRole("textbox", { name: name })).toHaveValue(testValue);
      },
    );

    it("fills month from session storage when page is loaded", () => {
      window.sessionStorage.setItem("dateOfBirthMonth", "1");
      renderWithRouter();
      expect(
        screen.getByRole("combobox", {
          name: "Month *",
        }),
      ).toHaveDisplayValue("01 - January");
    });
  });

  describe("contact info fields", () => {
    it.each(contactInformationFields)(
      "updates the $name text input",
      async ({ name, testValue, expectedValue }) => {
        const user = userEvent.setup();
        renderWithRouter();
        const input = screen.getByRole("textbox", {
          name: name,
        });
        expect(input).toHaveValue("");

        await user.type(input, testValue);
        expect(input).toHaveValue(expectedValue ?? testValue);
      },
    );

    it("saves form data on submit", async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allInputFields, new Set());
      await user.click(screen.getByRole("button", { name: "Next" }));

      for (const field of contactInformationFields) {
        expect(window.sessionStorage.getItem(field.key)).toEqual(
          field.expectedValue ?? field.testValue,
        );
      }

      expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/2");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it.each([
      {
        name: "Social security number *",
        lowercaseName: "social security number",
      },
      {
        name: "Phone number *",
        lowercaseName: "phone number",
      },
    ])("validates $lowercaseName", async ({ name, lowercaseName }) => {
      const user = userEvent.setup();
      renderWithRouter();
      const input = screen.getByRole("textbox", {
        name: name,
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");

      await user.type(input, "123");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Entered value does not match ${lowercaseName} format`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it.each([["invalid-email"], ["invalid@email"], ["invalid.email"]])(
      "displays an error message if the invalid email format %s is submitted",
      async () => {
        const user = userEvent.setup();
        renderWithRouter();

        const input = screen.getByRole("textbox", {
          name: `Email address *`,
        });
        await user.type(input, "invalid-email");
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining("Entered value does not match email format"),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
      },
    );

    it.each(requiredContactInformationFields)(
      "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
      async ({ name, key }) => {
        const user = userEvent.setup();
        renderWithRouter();

        const labelWithoutAsterisk = name.replace(" *", "");
        const input = await getInputField(screen, { name });
        expect(input).toBeRequired();
        await fillAllInputsExcept(screen, user, allInputFields, new Set([key]));
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining(`${labelWithoutAsterisk} is required`),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveFocus();
      },
    );

    it.each(contactInformationFields)(
      "fills $name from session storage when page is loadad",
      async ({ name, key, testValue }) => {
        window.sessionStorage.setItem(key, testValue);
        renderWithRouter();
        expect(screen.getByRole("textbox", { name: name })).toHaveValue(testValue);
      },
    );
  });
});
