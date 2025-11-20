import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";

const currentYear: number = new Date().getFullYear();

const insuranceStartDateMonthField = createTestField({
  name: "Month *",
  dataStoreKey: "insuranceStartDateMonth",
  required: true,
  testValue: "July",
  expectedValue: "7",
  role: "combobox",
  withinGroupName: `Start date * For example: April 28 ${currentYear - 1}`,
  alternateRequiredFieldError: "Start month is required",
});

export const insuranceStartDateDayField = createTestField({
  name: "Day *",
  dataStoreKey: "insuranceStartDateDay",
  required: true,
  testValue: "6",
  withinGroupName: `Start date * For example: April 28 ${currentYear - 1}`,
  alternateRequiredFieldError: "Start day is required",
});
export const insuranceStartDateYearField = createTestField({
  name: "Year *",
  dataStoreKey: "insuranceStartDateYear",
  required: true,
  testValue: "1988",
  withinGroupName: `Start date * For example: April 28 ${currentYear - 1}`,
  alternateRequiredFieldError: "Start year is required",
});

const insuranceEndDateMonthField = createTestField({
  name: "Month *",
  dataStoreKey: "insuranceEndDateMonth",
  required: true,
  testValue: "February",
  expectedValue: "2",
  role: "combobox",
  withinGroupName: `End date * For example: April 28 ${currentYear + 3}`,
  alternateRequiredFieldError: "End month is required",
});

export const insuranceEndDateDayField = createTestField({
  name: "Day *",
  dataStoreKey: "insuranceEndDateDay",
  required: true,
  testValue: "30",
  withinGroupName: `End date * For example: April 28 ${currentYear + 3}`,
  alternateRequiredFieldError: "End day is required",
});

export const insuranceEndDateYearField = createTestField({
  name: "Year *",
  dataStoreKey: "insuranceEndDateYear",
  required: true,
  testValue: "2025",
  withinGroupName: `End date * For example: April 28 ${currentYear + 3}`,
  alternateRequiredFieldError: "End year is required",
});

export const insuranceCoverageFields: Array<TestField> = [
  insuranceStartDateDayField,
  insuranceStartDateMonthField,
  insuranceStartDateYearField,
  insuranceEndDateDayField,
  insuranceEndDateMonthField,
  insuranceEndDateYearField,
];

export const amountPerOccurrenceField: TestField = {
  name: "Amount per occurrence *",
  dataStoreKey: "insuranceOccurenceAmount",
  requiredErrorMessage: "Amount per occurrence is required",
  role: "textbox",
  required: true,
  testValue: "1000005",
  expectedValue: "1000005",
};

export const amountPerAggregateField: TestField = {
  name: "Amount per aggregate *",
  dataStoreKey: "insuranceAggregateAmount",
  requiredErrorMessage: "Amount per aggregate is required",
  role: "textbox",
  required: true,
  testValue: "3000300",
  expectedValue: "3000300",
};

export const coverageAmountFields: Array<TestField> = createTestFields([
  amountPerOccurrenceField,
  amountPerAggregateField,
]);

export const testFields: Array<TestField> = [...insuranceCoverageFields, ...coverageAmountFields];
