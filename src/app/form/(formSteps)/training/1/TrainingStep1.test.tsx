import TrainingStep1 from "@/app/form/(formSteps)/training/1/TrainingStep1";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  testConditionalRender,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { fillField } from "@form/_utils/testUtils/fillInputs";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const trainingAddressGroupName = "What is the address of your training organization? *";

const childrensFuturesTrainingOrganization: TestField = createTestField({
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "combobox",
  testValue: "Children's Futures (Trenton)",
  sessionStorageKey: "stateApprovedTraining",
});

const noneTrainingOrganization: TestField = createTestField({
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "combobox",
  testValue: "None of these",
  sessionStorageKey: "stateApprovedTraining",
});

const nameOfTrainingOrganization: TestField = createTestField({
  name: "What is the name of your training organization? *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "textbox",
  testValue: "Test organization",
  sessionStorageKey: "nameOfTrainingOrganization",
  prerequisiteField: noneTrainingOrganization,
});

const yesDoulaTrainingInPerson: TestField = createTestField({
  name: "Yes, in person or hybrid",
  sessionStorageKey: "isDoulaTrainingInPerson",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "true",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
});

const noDoulaTrainingInPerson: TestField = createTestField({
  name: "No, it was virtual",
  sessionStorageKey: "isDoulaTrainingInPerson",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "false",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
});

const trainingAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    sessionStorageKey: "trainingStreetAddress1",
    alternateRequiredFieldError: "Training street address is required",
    testValue: "Test address 1",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "Street address line 2",
    required: false,
    sessionStorageKey: "trainingStreetAddress2",
    testValue: "Test address 2",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "City *",
    required: true,
    alternateRequiredFieldError: "Training city is required",
    sessionStorageKey: "trainingCity",
    testValue: "Test city",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "State *",
    required: false,
    alternateRequiredFieldError: "Training state is required",
    role: "combobox",
    testValue: "NJ",
    sessionStorageKey: "trainingState",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "ZIP code *",
    required: true,
    alternateRequiredFieldError: "Training zip code is required",
    sessionStorageKey: "trainingZip",
    testValue: "12345",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
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
  childrensFuturesTrainingOrganization,
  noDoulaTrainingInPerson,
  ...trainingInstructorFields,
];

const allTestFields = [
  noneTrainingOrganization,
  nameOfTrainingOrganization,
  yesDoulaTrainingInPerson,
  ...trainingAddressFields,
  ...trainingInstructorFields,
];

const renderFunction = () => renderWithRouter(<TrainingStep1 />, "/form/training/1");

describe("<TrainingStep1 />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe("doula training organization fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when a state-approved training organization is selected", async () => {
        await testSaveFieldsToSessionStorage(
          [childrensFuturesTrainingOrganization],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it("when 'None of these' is selected and the training organization name is provided", async () => {
        await testSaveFieldsToSessionStorage(
          [noneTrainingOrganization, nameOfTrainingOrganization],
          allTestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when a stateApprovedTraining is not filled in", async () => {
        await testRequiredField(
          childrensFuturesTrainingOrganization,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it("when None of the these is selected and nameOfTrainingOrganization is not filled in", async () => {
        await testRequiredField(nameOfTrainingOrganization, allTestFields, renderFunction, screen);
      });
    });

    it.each([
      childrensFuturesTrainingOrganization,
      noneTrainingOrganization,
      nameOfTrainingOrganization,
    ])(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderFunction, screen);
      },
    );

    it("conditionally renders custom training organization based on stateApprovedTraining", async () => {
      await testConditionalRender(
        nameOfTrainingOrganization,
        childrensFuturesTrainingOrganization,
        renderFunction,
        screen,
      );
    });

    it("shows alert text if None of these is selected", async () => {
      const user = userEvent.setup();
      renderFunction();
      await fillField(screen, user, noneTrainingOrganization);
      const input = screen.getByRole("textbox", {
        name: "What is the name of your training organization? *",
      });
      expect(input).toHaveAccessibleDescription(
        "If your training organization isn't listed, you may not be eligible to apply right now. Contact the Doula Guides at mahs.doulaguide@dhs.nj.gov to learn more.",
      );
    });
  });

  describe("doula training address fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when training was virtual", async () => {
        await testSaveFieldsToSessionStorage(
          [noDoulaTrainingInPerson],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it("when training was in person or hybrid", async () => {
        await testSaveFieldsToSessionStorage(
          [yesDoulaTrainingInPerson, ...trainingAddressFields],
          allTestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when a isDoulaTrainingInPerson is not filled in", async () => {
        await testRequiredField(
          yesDoulaTrainingInPerson,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it.each(trainingAddressFields.filter((field) => field.required))(
        "when training was in person or hybrid and $sessionStorageKey is not filled in",
        async (field: TestField) => {
          await testRequiredField(field, allTestFields, renderFunction, screen);
        },
      );
    });

    it.each(trainingAddressFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
      },
    );

    it.each([noDoulaTrainingInPerson, yesDoulaTrainingInPerson, ...trainingAddressFields])(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderFunction, screen);
      },
    );

    it.each(trainingAddressFields.filter((field) => field.required))(
      "conditionally renders $sessionStorageKey based on isDoulaTrainingInPerson",
      async (field: TestField) => {
        await testConditionalRender(field, noDoulaTrainingInPerson, renderFunction, screen);
      },
    );
  });

  describe("doula training instructor fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        trainingInstructorFields,
        minimalTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(trainingInstructorFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalTestFields, renderFunction, screen);
      },
    );

    it.each(trainingInstructorFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderFunction, screen);
      },
    );
  });
});
