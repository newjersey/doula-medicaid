import TrainingStep1 from "@form/(formSteps)/training/1/page";
import { getInputField, type InputField } from "@form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@form/_utils/testUtils/RouterPathnameProvider";
import { jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const trainingAddressGroupName = "What is the address of your training organization? *";
const trainingAddressFields: InputField[] = [
  {
    name: "Street address *",
    key: "trainingStreetAddress1",
    testValue: "Test address 1",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "Street address line 2",
    key: "trainingStreetAddress2",
    testValue: "Test address 2",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "City *",
    key: "trainingCity",
    testValue: "Test city",
    withinGroupName: trainingAddressGroupName,
  },
  {
    name: "ZIP code *",
    key: "trainingZip",
    testValue: "12345",
    withinGroupName: trainingAddressGroupName,
  },
];

const requiredKeys = ["trainingStreetAddress1", "trainingCity", "trainingZip"];

const requiredFields: Array<InputField> = trainingAddressFields.filter((field) =>
  requiredKeys.includes(field.key),
);

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

  describe("doula training address fields", () => {
    it("conditionally renders training address fields based on isDoulaTrainingInPerson", async () => {
      const user = userEvent.setup();
      renderWithRouter();

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

    it.each(requiredFields)(
      "clicking on the $name error focuses on the input",
      async ({ name }) => {
        const labelWithoutAsterisk = name.replace(" *", "");
        const user = userEvent.setup();
        renderWithRouter();

        await user.click(screen.getByRole("radio", { name: "Yes, in person or hybrid" }));
        await user.click(screen.getByRole("button", { name: "Next" }));
        await user.click(
          screen.getByRole("link", {
            name: `Training ${labelWithoutAsterisk.toLowerCase()} is required`,
          }),
        );

        const input = screen.getByRole("textbox", {
          name: `${labelWithoutAsterisk} *`,
        });
        expect(input).toHaveFocus();
      },
    );
  });

  it("displays an error summary if there are 3 or more errors", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await user.click(screen.getByRole("radio", { name: "Yes, in person or hybrid" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    const focusedElement = document.activeElement as HTMLElement;
    expect(
      within(focusedElement).getByRole("heading", {
        name: "There is a problem",
      }),
    ).toBeInTheDocument();

    const expectedErrorMessages = [
      "Training street address is required",
      "Training city is required",
      "Training zip code is required",
    ];
    for (const errorMessage of expectedErrorMessages) {
      expect(focusedElement).toHaveTextContent(errorMessage);
    }
  });

  it("fills fields from sessionStorage", async () => {
    window.sessionStorage.setItem("trainingStreetAddress1", "123 Main St");
    window.sessionStorage.setItem("trainingStreetAddress2", "Apt 4B");
    window.sessionStorage.setItem("trainingCity", "Newark");
    window.sessionStorage.setItem("trainingState", "NJ");
    window.sessionStorage.setItem("trainingZip", "12345");
    window.sessionStorage.setItem("isDoulaTrainingInPerson", "true");
    renderWithRouter();

    expect(screen.getByRole("radio", { name: "Yes, in person or hybrid" })).toBeChecked();
    expect(screen.getByRole("textbox", { name: "Street address *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveValue("Apt 4B");
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });
});
