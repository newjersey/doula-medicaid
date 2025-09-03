import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label, TextInput } from "@trussworks/react-uswds";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";

interface DoulaFormTestData {
  field1: string | null;
  field2: string | null;
  field3: string | null;
}

const orderedInputNameToLabel = {
  field1: "Label 1",
  field2: "Label 2",
  field3: "Label 3",
};

const DoulaFormTestPage = (props: { mayHaveThreeOrMoreErrors: boolean }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<DoulaFormTestData>({
    defaultValues: {
      field1: "",
      field2: "",
      field3: "",
    },
    shouldFocusError: !props.mayHaveThreeOrMoreErrors,
  });

  return (
    <DoulaForm<DoulaFormTestData>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={props.mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Doula Form Test</h2>
          <Label htmlFor="field1" requiredMarker>
            {orderedInputNameToLabel["field1"]}
          </Label>
          <div id="field1Hint" className="usa-hint">
            Field 1
          </div>
          <TextInput
            id="field1"
            type="text"
            required
            validationStatus={errors.field1 ? "error" : undefined}
            aria-invalid={errors.field1 ? "true" : "false"}
            aria-describedby={errors.field1 && "field1ErrorMessage"}
            {...register("field1", {
              required: `${orderedInputNameToLabel["field1"]} is required`,
            })}
          />
          {errors.field1 && (
            <span id="field1ErrorMessage" className="usa-error-message">
              {errors.field1.message}
            </span>
          )}
          <Label htmlFor="field2" requiredMarker>
            {orderedInputNameToLabel["field2"]}
          </Label>
          <div id="field1Hint" className="usa-hint">
            Field 2
          </div>
          <TextInput
            id="field2"
            type="text"
            required
            validationStatus={errors.field2 ? "error" : undefined}
            aria-invalid={errors.field2 ? "true" : "false"}
            aria-describedby={errors.field2 && "field2ErrorMessage"}
            {...register("field2", {
              required: `${orderedInputNameToLabel["field2"]} is required`,
            })}
          />
          {errors.field2 && (
            <span id="field2ErrorMessage" className="usa-error-message">
              {errors.field2.message}
            </span>
          )}
          <Label htmlFor="field3" requiredMarker>
            {orderedInputNameToLabel["field3"]}
          </Label>
          <div id="field1Hint" className="usa-hint">
            Field 3
          </div>
          <TextInput
            id="field3"
            type="text"
            required
            validationStatus={errors.field3 ? "error" : undefined}
            aria-invalid={errors.field3 ? "true" : "false"}
            aria-describedby={errors.field3 && "field3ErrorMessage"}
            {...register("field3", {
              required: `${orderedInputNameToLabel["field3"]} is required`,
            })}
          />
          {errors.field3 && (
            <span id="field3ErrorMessage" className="usa-error-message">
              {errors.field3.message}
            </span>
          )}
        </div>
      </div>
      <FormProgressButtons />
    </DoulaForm>
  );
};

const renderWithRouter = (mayHaveThreeOrMoreErrors: boolean) => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockRouter: Partial<AppRouterInstance> = {
    push: mockPush,
    refresh: mockRefresh,
  };

  render(
    <RouterPathnameProvider
      pathname="/form/personal-details/2"
      router={mockRouter as AppRouterInstance}
    >
      <DoulaFormTestPage mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors} />
    </RouterPathnameProvider>,
  );
  return mockRouter;
};

describe("error summary", () => {
  describe("when mayHaveThreeOrMoreErrors is true", () => {
    it("shows an error summary if there are 3 or more errors", async () => {
      const user = userEvent.setup();
      renderWithRouter(true);
      await user.click(screen.getByRole("button", { name: "Next" }));

      const focusedElement = document.activeElement as HTMLElement;
      expect(
        screen.getByRole("heading", {
          name: "There is a problem",
        }),
      ).toBeInTheDocument();

      const expectedErrorMessages = [
        "Label 1 is required",
        "Label 2 is required",
        "Label 3 is required",
      ];
      for (const errorMessage of expectedErrorMessages) {
        expect(focusedElement).toHaveTextContent(errorMessage);
      }
    });

    it("does not show an error summary if there are fewer than 3 errors, instead it focuses on the first error", async () => {
      const user = userEvent.setup();
      renderWithRouter(true);
      await user.type(
        screen.getByRole("textbox", {
          name: "Label 1 *",
        }),
        "Value 1",
      );

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(
        screen.queryByRole("heading", {
          name: "There is a problem",
        }),
      ).not.toBeInTheDocument();

      const errorMessage = "Label 2 is required";
      const focusedElement = document.activeElement as HTMLElement;
      expect(focusedElement).toHaveAccessibleDescription(errorMessage);
    });
  });

  describe("when mayHaveThreeOrMoreErrors is false", () => {
    it("does not show an error summary if there are 3 errors, instead it focuses on the first error", async () => {
      const user = userEvent.setup();
      renderWithRouter(false);

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(
        screen.queryByRole("heading", {
          name: "There is a problem",
        }),
      ).not.toBeInTheDocument();

      const errorMessage = "Label 1 is required";
      const focusedElement = document.activeElement as HTMLElement;
      expect(focusedElement).toHaveAccessibleDescription(errorMessage);
    });
  });
});
