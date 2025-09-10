import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestFields,
  type TestField,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
} from "@/app/form/_utils/testUtils/sharedTests";
import PersonalDetailsStep1 from "@form/(formSteps)/personal-details/1/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const personalIdentificationFields: Array<TestField> = createTestFields([
  {
    name: "First name *",
    sessionStorageKey: "firstName",
    required: true,
    testValue: "Test first name",
  },
  {
    name: "Middle name",
    sessionStorageKey: "middleName",
    required: false,
    testValue: "Test middle name",
  },
  {
    name: "Last name *",
    sessionStorageKey: "lastName",
    required: true,
    testValue: "Test last name",
  },
  {
    name: "Day *",
    sessionStorageKey: "dateOfBirthDay",
    required: true,
    testValue: "6",
  },
  {
    name: "Month *",
    sessionStorageKey: "dateOfBirthMonth",
    required: true,
    testValue: "07 - July",
    expectedValue: "7",
    role: "combobox",
  },
  {
    name: "Year *",
    sessionStorageKey: "dateOfBirthYear",
    required: true,
    testValue: "1988",
  },
  {
    name: "Social security number *",
    sessionStorageKey: "socialSecurityNumber",
    required: true,
    testValue: "123456789",
    expectedValue: "123-45-6789",
    role: "textbox",
  },
]);

const contactInformationFields: Array<TestField> = createTestFields([
  {
    name: "Email address *",
    sessionStorageKey: "email",
    testValue: "test@test.com",
    required: true,
  },
  {
    name: "Phone number *",
    sessionStorageKey: "phoneNumber",
    testValue: "3211234567",
    expectedValue: "321-123-4567",
    required: true,
  },
]);

const allTestFields: Array<TestField> = [
  ...personalIdentificationFields,
  ...contactInformationFields,
];

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
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        personalIdentificationFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/personal-details/2",
      );
    });

    it.each(personalIdentificationFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        const sessionStorageKey = field.sessionStorageKey; // eslint-disable-line @typescript-eslint/no-unused-vars
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(personalIdentificationFields.filter((field) => field.required))(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        const sessionStorageKey = field.sessionStorageKey; // eslint-disable-line @typescript-eslint/no-unused-vars
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

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
  });

  describe("contact info fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        contactInformationFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/personal-details/2",
      );
    });

    it.each(contactInformationFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        const sessionStorageKey = field.sessionStorageKey; // eslint-disable-line @typescript-eslint/no-unused-vars
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(contactInformationFields.filter((field) => field.required))(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        const sessionStorageKey = field.sessionStorageKey; // eslint-disable-line @typescript-eslint/no-unused-vars
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

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
  });
});
