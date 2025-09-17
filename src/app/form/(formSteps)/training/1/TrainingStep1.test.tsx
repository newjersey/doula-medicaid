import {
  createTestFields,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import TrainingStep1 from "@form/(formSteps)/training/1/page";
import { getInputField } from "@form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@form/_utils/testUtils/RouterPathnameProvider";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const trainingAddressGroupName = "What is the address of your training organization? *";

const childrensFuturesTrainingOrganization: TestField = {
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "combobox" as const,
  testValue: "Children's Futures (Trenton)",
  expectedValue: "Children's Futures (Trenton)",
  sessionStorageKey: "stateApprovedTraining",
};

const noneTrainingOrganization: TestField = {
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "combobox" as const,
  testValue: "None of these",
  expectedValue: "None of these",
  sessionStorageKey: "stateApprovedTraining",
};

const trainingOrganizationFields = createTestFields([
  noneTrainingOrganization,
  {
    name: "What is the name of your training organization? *",
    required: true,
    alternateRequiredFieldError: "This question is required",
    sessionStorageKey: "nameOfTrainingOrganization",
    testValue: "Test organization",
    prerequisiteField: noneTrainingOrganization,
  },
]);

const yesDoulaInPerson: TestField = {
  name: "Yes, in person or hybrid",
  sessionStorageKey: "isDoulaTrainingInPerson",
  requiredErrorMessage: "This question is required",
  required: true,
  role: "radio" as const,
  testValue: "true",
  expectedValue: "true",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
};

const noDoulaTrainingInPerson: TestField = {
  name: "No, it was virtual",
  sessionStorageKey: "isDoulaTrainingInPerson",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
};

const trainingAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    sessionStorageKey: "trainingStreetAddress1",
    alternateRequiredFieldError: "Training street address is required",
    testValue: "Test address 1",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaInPerson,
  },
  {
    name: "Street address line 2",
    required: false,
    sessionStorageKey: "trainingStreetAddress2",
    testValue: "Test address 2",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaInPerson,
  },
  {
    name: "City *",
    required: true,
    alternateRequiredFieldError: "Training city is required",
    sessionStorageKey: "trainingCity",
    testValue: "Test city",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaInPerson,
  },
  {
    name: "State *",
    required: false,
    alternateRequiredFieldError: "Training state is required",
    role: "combobox",
    testValue: "NJ",
    sessionStorageKey: "trainingState",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaInPerson,
  },
  {
    name: "ZIP code *",
    required: true,
    alternateRequiredFieldError: "Training zip code is required",
    sessionStorageKey: "trainingZip",
    testValue: "12345",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaInPerson,
  },
]);

const trainingInstructorFields: TestField[] = createTestFields([
  {
    name: "First name *",
    required: true,
    sessionStorageKey: "instructorFirstName",
    testValue: "Jane",
  },
  {
    name: "Last name *",
    required: true,
    sessionStorageKey: "instructorLastName",
    testValue: "Doe",
  },
  {
    name: "Email address *",
    required: true,
    sessionStorageKey: "instructorEmail",
    testValue: "test@example.com",
  },
  {
    name: "Phone number",
    required: false,
    sessionStorageKey: "instructorPhoneNumber",
    testValue: "111-111-1111",
  },
]);

const minimalTestFields = [
  ...trainingOrganizationFields,
  noDoulaTrainingInPerson,
  ...trainingInstructorFields,
];

const allTestFields = [
  ...trainingOrganizationFields,
  yesDoulaInPerson,
  ...trainingAddressFields,
  ...trainingInstructorFields,
];

const selectTrainingOrganization = async (
  organization: string = "Children's Home Society of NJ (Trenton)",
) => {
  const user = userEvent.setup();
  const field = {
    name: "Which state-approved training did you complete? Select one *",
    role: "combobox" as const,
  };
  const input = await getInputField(screen, field);
  await user.selectOptions(input, organization);
};

const fillTrainingInstructorFields = async () => {
  const user = userEvent.setup();
  for (const field of trainingInstructorFields) {
    const input = await getInputField(screen, field);
    await user.type(input, field.testValue!);
  }
};

const renderWithRouter = () => {
  const mockRouter: Partial<AppRouterInstance> = {
    push: jest.fn(),
    refresh: jest.fn(),
  };
  render(
    <RouterPathnameProvider pathname="/form/training/1" router={mockRouter as AppRouterInstance}>
      <TrainingStep1 />
    </RouterPathnameProvider>,
  );
  return mockRouter;
};

describe("<TrainingStep1 />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe("doula training organization fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when a state-approved training organization is selected", async () => {
        await testSaveFieldsToSessionStorage(
          [childrensFuturesTrainingOrganization],
          [
            childrensFuturesTrainingOrganization,
            noDoulaTrainingInPerson,
            ...trainingInstructorFields,
          ],
          renderWithRouter,
          screen,
          "/form/personal-details/1",
        );
      });

      it("when 'None of these' is selected and the training organization name is provided", async () => {
        await testSaveFieldsToSessionStorage(
          trainingOrganizationFields,
          minimalTestFields,
          renderWithRouter,
          screen,
          "/form/personal-details/1",
        );
      });
    });

    describe("marks fields as required and displays an error message if it is not filled in", () => {
      it.each([childrensFuturesTrainingOrganization].filter((field) => field.required))(
        "when a stateApprovedTraining organization is selected",
        async (field: TestField) => {
          await testRequiredField(
            field,
            [
              childrensFuturesTrainingOrganization,
              noDoulaTrainingInPerson,
              ...trainingInstructorFields,
            ],
            renderWithRouter,
            screen,
          );
        },
      );

      it("when None of the these is selected", async () => {
        const user = userEvent.setup();
        const alertText =
          "If your training organization isn't listed, you may not be eligible to apply right now. Contact the Doula Guides at mahs.doulaguide@dhs.nj.gov to learn more.";
        renderWithRouter();
        expect(
          screen.queryByRole("textbox", {
            name: "What is the name of your training organization? *",
          }),
        ).not.toBeInTheDocument();
        await selectTrainingOrganization("None of these");
        const input = screen.getByRole("textbox", {
          name: "What is the name of your training organization? *",
        });
        expect(input).toBeInTheDocument();
        expect(input).toHaveAccessibleDescription(alertText);
        await user.click(screen.getByRole("radio", { name: "No, it was virtual" }));
        await fillTrainingInstructorFields();
        await user.click(screen.getByRole("button", { name: "Next" }));
        expect(input).toHaveFocus();
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAccessibleDescription(
          expect.stringContaining("This question is required"),
        );
        expect(input).toHaveAccessibleDescription(expect.stringContaining(alertText));
      });
    });

    it.each(trainingOrganizationFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );
  });

  describe("doula training address fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when yesDoulaTrainingInPerson", async () => {
        await testSaveFieldsToSessionStorage(
          trainingAddressFields,
          allTestFields,
          renderWithRouter,
          screen,
          "/form/personal-details/1",
        );
      });

      it("when noDoulaTrainingInPerson", async () => {
        await testSaveFieldsToSessionStorage(
          [noDoulaTrainingInPerson],
          minimalTestFields,
          renderWithRouter,
          screen,
          "/form/personal-details/1",
        );
      });
    });

    it.each(trainingAddressFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(trainingAddressFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    it("conditionally renders training address fields based on isDoulaTrainingInPerson", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      await selectTrainingOrganization();
      expect(
        screen.queryByRole("group", { name: trainingAddressGroupName }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole("radio", { name: "Yes, in person or hybrid" }));

      expect(screen.getByRole("group", { name: trainingAddressGroupName })).toBeInTheDocument();
      for (const field of trainingAddressFields) {
        const input = await getInputField(screen, field);
        expect(input).toBeInTheDocument();
        await user.type(input, field.testValue!);
      }

      await user.click(screen.getByRole("radio", { name: "No, it was virtual" }));
      expect(
        screen.queryByRole("group", { name: trainingAddressGroupName }),
      ).not.toBeInTheDocument();
      await user.click(screen.getByRole("radio", { name: "Yes, in person or hybrid" }));

      for (const field of trainingAddressFields) {
        const input = await getInputField(screen, field);
        expect(input).toHaveValue(field.testValue);
      }
    });
  });

  describe("doula training instructor fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        trainingInstructorFields,
        minimalTestFields,
        renderWithRouter,
        screen,
        "/form/personal-details/1",
      );
    });

    it.each(trainingInstructorFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalTestFields, renderWithRouter, screen);
      },
    );

    it.each(trainingInstructorFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );
  });
});
