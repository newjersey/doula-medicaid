import { createTestFields, type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import TrainingStep1 from "@form/(formSteps)/training/1/page";
import { getInputField } from "@form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@form/_utils/testUtils/RouterPathnameProvider";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const trainingAddressGroupName = "What is the address of your training organization? *";
const trainingAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    sessionStorageKey: "trainingStreetAddress1",
    testValue: "Test address 1",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "Street address line 2",
    required: false,
    sessionStorageKey: "trainingStreetAddress2",
    testValue: "Test address 2",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "City *",
    required: true,
    sessionStorageKey: "trainingCity",
    testValue: "Test city",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "ZIP code *",
    required: true,
    sessionStorageKey: "trainingZip",
    testValue: "12345",
    withinGroupName: trainingAddressGroupName,
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
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockRouter: Partial<AppRouterInstance> = {
    push: mockPush,
    refresh: mockRefresh,
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
    it("asks the user for the name of their training organization if 'None of these' is selected", async () => {
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

    it("saves the selected org to sessionStorage", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await selectTrainingOrganization("None of these");
      const input = screen.getByRole("textbox", {
        name: "What is the name of your training organization? *",
      });
      await user.type(input, "Test org name");
      await user.click(screen.getByRole("radio", { name: "No, it was virtual" }));
      await fillTrainingInstructorFields();
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(sessionStorage.getItem("stateApprovedTraining")).toBe("None of these");
      expect(sessionStorage.getItem("nameOfTrainingOrganization")).toBe("Test org name");
    });
  });

  describe("doula training address fields", () => {
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

    it("requires an answer to isDoulaTrainingInPerson", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      await selectTrainingOrganization();
      await fillTrainingInstructorFields();
      await user.click(screen.getByRole("button", { name: "Next" }));

      const inputYes = screen.getByRole("radio", { name: "Yes, in person or hybrid" });
      const inputNo = screen.getByRole("radio", { name: "No, it was virtual" });
      expect(inputYes).toHaveFocus();
      expect(inputYes).toHaveAttribute("aria-invalid", "true");
      expect(inputYes).toHaveAccessibleDescription(
        expect.stringContaining("This question is required"),
      );
      expect(inputNo).toHaveAttribute("aria-invalid", "true");
      expect(inputNo).toHaveAccessibleDescription(
        expect.stringContaining("This question is required"),
      );
    });
  });

  describe("doula training instructor fields", () => {
    it("saves values to session storage when user clicks Next", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await selectTrainingOrganization();
      await user.click(screen.getByRole("radio", { name: "No, it was virtual" }));
      await fillTrainingInstructorFields();
      await user.click(screen.getByRole("button", { name: "Next" }));
      for (const field of trainingInstructorFields) {
        expect(sessionStorage.getItem(field.sessionStorageKey)).toBe(field.testValue);
      }
    });
  });

  it("fills fields from sessionStorage", async () => {
    window.sessionStorage.setItem("stateApprovedTraining", "None of these");
    window.sessionStorage.setItem("nameOfTrainingOrganization", "Test training org");
    window.sessionStorage.setItem("trainingStreetAddress1", "123 Main St");
    window.sessionStorage.setItem("trainingStreetAddress2", "Apt 4B");
    window.sessionStorage.setItem("trainingCity", "Newark");
    window.sessionStorage.setItem("trainingState", "NJ");
    window.sessionStorage.setItem("trainingZip", "12345");
    window.sessionStorage.setItem("isDoulaTrainingInPerson", "true");
    window.sessionStorage.setItem("instructorFirstName", "First");
    window.sessionStorage.setItem("instructorLastName", "Last");
    window.sessionStorage.setItem("instructorEmail", "email@test.com");
    window.sessionStorage.setItem("instructorPhoneNumber", "111-111-1111");

    renderWithRouter();

    expect(
      screen.getByRole("combobox", {
        name: "Which state-approved training did you complete? Select one *",
      }),
    ).toHaveValue("None of these");
    expect(
      screen.getByRole("textbox", {
        name: "What is the name of your training organization? *",
      }),
    ).toHaveValue("Test training org");
    expect(screen.getByRole("radio", { name: "Yes, in person or hybrid" })).toBeChecked();
    expect(screen.getByRole("textbox", { name: "Street address *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveValue("Apt 4B");
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
    expect(screen.getByRole("textbox", { name: "First name *" })).toHaveValue("First");
    expect(screen.getByRole("textbox", { name: "Last name *" })).toHaveValue("Last");
    expect(screen.getByRole("textbox", { name: "Email address *" })).toHaveValue("email@test.com");
    expect(screen.getByRole("textbox", { name: "Phone number" })).toHaveValue("111-111-1111");
  });
});
