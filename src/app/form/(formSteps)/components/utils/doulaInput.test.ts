import {
  formatDescribedBy,
  formatInputErrorLabel,
} from "@/app/form/(formSteps)/components/utils/doulaInput";

describe("formatDescribedBy", () => {
  const inputName = "testId";
  it.each([
    {
      description: "there are no descriptions",
      errors: undefined,
      hint: undefined,
      additionalDescriptionIds: undefined,
      expected: "",
    },
    {
      description: "there is no error for the input",
      errors: {
        differentInput: {
          type: "required",
          message: "This field is required",
        },
      },
      hint: undefined,
      additionalDescriptionIds: undefined,
      expected: "",
    },
    {
      description: "there is an error",
      errors: {
        testId: {
          type: "required",
          message: "This field is required",
        },
      },
      hint: undefined,
      additionalDescriptionIds: undefined,
      expected: "testIdErrorMessage",
    },
    {
      description: "hint is provided",
      errors: undefined,
      hint: "test hint",
      additionalDescriptionIds: undefined,
      expected: "testIdHint",
    },
    {
      description: "additional description ids is provided",
      errors: undefined,
      hint: undefined,
      additionalDescriptionIds: "descriptionId1 descriptionId2",
      expected: "descriptionId1 descriptionId2",
    },
    {
      description:
        "there is an error, a hint is provided, and additional description ids is provided",
      errors: {
        testId: {
          type: "required",
          message: "This field is required",
        },
      },
      hint: "test hint",
      additionalDescriptionIds: "descriptionId1 descriptionId2",
      expected: "testIdErrorMessage testIdHint descriptionId1 descriptionId2",
    },
  ])(
    "correctly formats the description ids when $description",
    ({ errors, hint, additionalDescriptionIds, expected }) => {
      expect(
        formatDescribedBy<{ testId: string; differentInput: string }>(
          inputName,
          errors,
          hint,
          additionalDescriptionIds,
        ),
      ).toEqual(expected);
    },
  );
});

describe("formatInputErrorLabel", () => {
  it("correctly formats the input error label", () => {
    expect(formatInputErrorLabel("Hi", "Prefix", true)).toEqual("Prefix Hi");
    expect(formatInputErrorLabel("Hi", "Prefix", false)).toEqual("Prefix hi");
    expect(formatInputErrorLabel("Hi", undefined, true)).toEqual("Hi");
    expect(formatInputErrorLabel("Hi", undefined, false)).toEqual("Hi");
    expect(formatInputErrorLabel("Hi", "Prefix")).toEqual("Prefix hi");
    expect(formatInputErrorLabel("Hi", undefined)).toEqual("Hi");
  });
});
