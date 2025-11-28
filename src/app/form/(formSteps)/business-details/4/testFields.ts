import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";

const currentYear: number = new Date().getFullYear();

export const noHasFiledBankruptcy: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasFiledBankruptcy",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Have you filed for bankruptcy in the past 7 years? Select one *",
});

const yesHasFiledBankruptcy: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasFiledBankruptcy",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName: "Have you filed for bankruptcy in the past 7 years? Select one *",
});
export const pastBankruptcyDateFields = createTestFields([
  {
    name: "Month *",
    dataStoreKey: "pastBankruptcyMonth",
    required: true,
    testValue: "July",
    expectedValue: "7",
    role: "combobox",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledBankruptcy,
    alternateRequiredFieldError: "Past bankruptcy month is required",
  },
  {
    name: "Day *",
    dataStoreKey: "pastBankruptcyDay",
    required: true,
    testValue: "6",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledBankruptcy,
    alternateRequiredFieldError: "Past bankruptcy day is required",
  },
  {
    name: "Year *",
    dataStoreKey: "pastBankruptcyYear",
    required: true,
    testValue: "2024",
    withinGroupName: `When did you file for bankruptcy? * For example: January 1 ${currentYear - 2}`,
    prerequisiteField: yesHasFiledBankruptcy,
    alternateRequiredFieldError: "Past bankruptcy year is required",
  },
]);

export const noMightFileBankruptcy: TestField = createTestField({
  name: "No",
  dataStoreKey: "mightFileBankruptcy",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Is there a possibility that you will file for bankruptcy in the next year? Select one *",
});
const yesMightFileBankruptcy: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "mightFileBankruptcy",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Is there a possibility that you will file for bankruptcy in the next year? Select one *",
});
export const futureBankruptcyDateFields = createTestFields([
  {
    name: "Month *",
    dataStoreKey: "futureBankruptcyMonth",
    required: true,
    testValue: "July",
    expectedValue: "7",
    role: "combobox",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileBankruptcy,
    alternateRequiredFieldError: "Future bankruptcy month is required",
  },
  {
    name: "Day *",
    dataStoreKey: "futureBankruptcyDay",
    required: true,
    testValue: "6",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileBankruptcy,
    alternateRequiredFieldError: "Future bankruptcy day is required",
  },
  {
    name: "Year *",
    dataStoreKey: "futureBankruptcyYear",
    required: true,
    testValue: "2024",
    withinGroupName: `When will you file for bankruptcy? * For example: January 1 ${currentYear + 1}`,
    prerequisiteField: yesMightFileBankruptcy,
    alternateRequiredFieldError: "Future bankruptcy year is required",
  },
]);

export const path1TestFields: Array<TestField> = [noHasFiledBankruptcy, noMightFileBankruptcy];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasFiledBankruptcy,
  yesMightFileBankruptcy,
];

export const path2TestFields: Array<TestField> = [
  yesHasFiledBankruptcy,
  ...pastBankruptcyDateFields,
  yesMightFileBankruptcy,
  ...futureBankruptcyDateFields,
];
