import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";

const currentYear: number = new Date().getFullYear();

export const noHasFiledForBankruptcyPast7Years: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasFiledForBankruptcyPast7Years",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Have you filed for bankruptcy in the past 7 years? Select one *",
});

const yesHasFiledForBankruptcyPast7Years: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasFiledForBankruptcyPast7Years",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName: "Have you filed for bankruptcy in the past 7 years? Select one *",
});
export const past7YearsBankruptcyDateFields = createTestFields([
  {
    name: "Month *",
    dataStoreKey: "past7YearsBankruptcyMonth",
    required: true,
    testValue: "July",
    expectedValue: "7",
    role: "combobox",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledForBankruptcyPast7Years,
    alternateRequiredFieldError: "Past bankruptcy month is required",
  },
  {
    name: "Day *",
    dataStoreKey: "past7YearsBankruptcyDay",
    required: true,
    testValue: "6",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledForBankruptcyPast7Years,
    alternateRequiredFieldError: "Past bankruptcy day is required",
  },
  {
    name: "Year *",
    dataStoreKey: "past7YearsBankruptcyYear",
    required: true,
    testValue: "2024",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledForBankruptcyPast7Years,
    alternateRequiredFieldError: "Past bankruptcy year is required",
  },
]);

export const noMightFileForBankruptcyNextYear: TestField = createTestField({
  name: "No",
  dataStoreKey: "mightFileForBankruptcyNextYear",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Is there a possibility that you will file for bankruptcy in the next year? Select one *",
});
const yesMightFileForBankruptcyNextYear: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "mightFileForBankruptcyNextYear",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Is there a possibility that you will file for bankruptcy in the next year? Select one *",
});
export const nextYearBankruptcyDateFields = createTestFields([
  {
    name: "Month *",
    dataStoreKey: "nextYearBankruptcyMonth",
    required: true,
    testValue: "July",
    expectedValue: "7",
    role: "combobox",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileForBankruptcyNextYear,
    alternateRequiredFieldError: "Future bankruptcy month is required",
  },
  {
    name: "Day *",
    dataStoreKey: "nextYearBankruptcyDay",
    required: true,
    testValue: "6",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileForBankruptcyNextYear,
    alternateRequiredFieldError: "Future bankruptcy day is required",
  },
  {
    name: "Year *",
    dataStoreKey: "nextYearBankruptcyYear",
    required: true,
    testValue: "2024",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileForBankruptcyNextYear,
    alternateRequiredFieldError: "Future bankruptcy year is required",
  },
]);

export const path1TestFields: Array<TestField> = [
  noHasFiledForBankruptcyPast7Years,
  noMightFileForBankruptcyNextYear,
];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasFiledForBankruptcyPast7Years,
  yesMightFileForBankruptcyNextYear,
];

export const path2TestFields: Array<TestField> = [
  yesHasFiledForBankruptcyPast7Years,
  ...past7YearsBankruptcyDateFields,
  yesMightFileForBankruptcyNextYear,
  ...nextYearBankruptcyDateFields,
];
