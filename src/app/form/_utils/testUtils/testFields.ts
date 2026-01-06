type TestFieldParameters = {
  name: string | RegExp;
  dataStoreKey: string;
  required: boolean;
  withinGroupName?: string;
  prerequisiteField?: TestField;
  alternateRequiredFieldError?: string;
} & (
  | {
      role?: "textbox" | "combobox" | "radio";
      testValue: string;
      expectedValue?: string;
    }
  | {
      role: "checkbox";
    }
);

export type TestField = {
  name: string | RegExp;
  dataStoreKey: string;
  required: boolean;
  requiredErrorMessage: string;
  withinGroupName?: string;
  prerequisiteField?: TestField;
  role: "textbox" | "combobox" | "radio" | "checkbox";
  testValue: string;
  expectedValue: string;
};

export const createTestField = (field: TestFieldParameters): TestField => {
  const commonTestFields = {
    name: field.name,
    dataStoreKey: field.dataStoreKey,
    required: field.required,
    requiredErrorMessage:
      field.alternateRequiredFieldError ??
      (field.role === "radio"
        ? "This question is required"
        : `${field.name.toString().replace(" *", "")} is required`),
    withinGroupName: field.withinGroupName,
    prerequisiteField: field.prerequisiteField,
  };

  if (field.role === "checkbox") {
    return {
      ...commonTestFields,
      role: field.role,
      testValue: "true",
      expectedValue: "true",
    };
  }

  return {
    ...commonTestFields,
    role: field.role ?? "textbox",
    testValue: field.testValue,
    expectedValue: field.expectedValue ?? field.testValue,
  };
};

export const createTestFields = (fields: Array<TestFieldParameters>): Array<TestField> => {
  const testFields: Array<TestField> = [];
  for (const field of fields) {
    testFields.push(createTestField(field));
  }
  return testFields;
};
