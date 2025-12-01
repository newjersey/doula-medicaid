import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import {
  fillAllInputs,
  fillAllInputsExcept,
  getInputField,
} from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { createTestFields, type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import * as nextThirdPartiesGoogle from "@next/third-parties/google";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import * as router from "react-router";

interface DoulaFormTestData {
  field1: string | null;
  field2: string | null;
  field3: string | null;
}

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
      orderedInputNames={["field1", "field2", "field3"]}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={props.mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Doula Form Test</h2>
          <DoulaTextInput
            name="field1"
            label="Label 1"
            required
            errors={errors}
            register={register}
          />
          <DoulaTextInput
            name="field2"
            label="Label 2"
            required
            errors={errors}
            register={register}
          />
          <DoulaTextInput
            name="field3"
            label="Label 3"
            required
            errors={errors}
            register={register}
          />
        </div>
      </div>
      <FormProgressButtons />
    </DoulaForm>
  );
};

const doulaTestFormFields: TestField[] = createTestFields([
  {
    name: "Label 1 *",
    required: true,
    dataStoreKey: "field1",
    testValue: "Foo",
  },
  {
    name: "Label 2 *",
    required: true,
    dataStoreKey: "field2",
    testValue: "Bar",
  },
  {
    name: "Label 3 *",
    required: true,
    dataStoreKey: "field3",
    testValue: "Zoink",
  },
]);

describe("submission behavior", () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("saves fields to the data store and routes to the next step on submit", async () => {
    const { mockUpdateDataStore } = renderWithProviders(
      <DoulaFormTestPage mayHaveThreeOrMoreErrors={true} />,
      "/form/personal-details/2",
    );
    const user = userEvent.setup();
    await fillAllInputs(screen, user, doulaTestFormFields);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(mockUpdateDataStore).toHaveBeenCalledWith({
      field1: "Foo",
      field2: "Bar",
      field3: "Zoink",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/form/personal-details/3");
  });

  it("does not save fields to the data store and does not route on error", async () => {
    const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
    const { mockUpdateDataStore } = renderWithProviders(
      <DoulaFormTestPage mayHaveThreeOrMoreErrors={true} />,
      "/form/personal-details/2",
    );
    const user = userEvent.setup();
    await fillAllInputsExcept(screen, user, doulaTestFormFields, new Set(["field1"]));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
      fieldName: "field1",
      type: "required",
    });
    expect(mockSendGAEvent).not.toHaveBeenCalledWith("event", "formValidationError", {
      fieldName: "field2",
      type: "required",
    });
    expect(mockUpdateDataStore).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("error summary", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("when mayHaveThreeOrMoreErrors is true", () => {
    it("shows an error summary if there are 3 or more errors", async () => {
      const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
      const user = userEvent.setup();
      renderWithProviders(
        <DoulaFormTestPage mayHaveThreeOrMoreErrors={true} />,
        "/form/personal-details/2",
      );
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

      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field1",
        type: "required",
      });
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field2",
        type: "required",
      });
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field3",
        type: "required",
      });
    });

    it("does not show an error summary if there are fewer than 3 errors, instead it focuses on the first error", async () => {
      const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
      const user = userEvent.setup();
      renderWithProviders(
        <DoulaFormTestPage mayHaveThreeOrMoreErrors={true} />,
        "/form/personal-details/2",
      );
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

      expect(mockSendGAEvent).not.toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field1",
        type: "required",
      });
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field2",
        type: "required",
      });
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "formValidationError", {
        fieldName: "field3",
        type: "required",
      });
    });
  });

  describe("when mayHaveThreeOrMoreErrors is false", () => {
    it("does not show an error summary if there are 3 errors, instead it focuses on the first error", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <DoulaFormTestPage mayHaveThreeOrMoreErrors={false} />,
        "/form/personal-details/2",
      );

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

  it.each(doulaTestFormFields)(
    "clicking on the $name error focuses on the input",
    async ({ name }) => {
      const labelWithoutAsterisk = name.toString().replace(" *", "");
      const user = userEvent.setup();
      renderWithProviders(
        <DoulaFormTestPage mayHaveThreeOrMoreErrors={true} />,
        "/form/personal-details/2",
      );
      await user.click(screen.getByRole("button", { name: "Next" }));
      await user.click(screen.getByRole("link", { name: `${labelWithoutAsterisk} is required` }));

      const input = await getInputField(screen, { name });
      expect(input).toHaveFocus();
    },
  );
});
