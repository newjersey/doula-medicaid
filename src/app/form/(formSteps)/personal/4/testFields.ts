import { createTestField, createTestFields } from "@/app/form/_utils/testUtils/testFields";

export const directDepositDetailsFields = createTestFields([
  {
    name: "Bank name *",
    required: true,
    dataStoreKey: "bankName",
    testValue: "Test bank name",
  },
  {
    name: "City *",
    required: true,
    dataStoreKey: "bankCity",
    testValue: "Test bank city",
  },
  {
    name: "State *",
    dataStoreKey: "bankState",
    required: true,
    testValue: "Pennsylvania",
    expectedValue: "PA",
    role: "combobox",
  },
  {
    name: "ZIP Code *",
    dataStoreKey: "bankZip",
    required: true,
    testValue: "11111",
  },
]);

const nameOnBankAccountField = createTestField({
  name: "Name on bank account *",
  required: true,
  dataStoreKey: "nameOnBankAccount",
  testValue: "The fancy name on my bank account",
});
export const hasJointBankAccountField = createTestField({
  name: "I have a joint bank account",
  required: false,
  dataStoreKey: "hasJointBankAccount",
  role: "checkbox",
});
export const secondNameOnJointBankAccountField = createTestField({
  name: "Second name on joint bank account *",
  required: true,
  dataStoreKey: "secondNameOnJointBankAccount",
  testValue: "The second person on this bank account",
  prerequisiteField: hasJointBankAccountField,
});
export const bankRoutingNumberField = createTestField({
  name: "Bank routing number *",
  required: true,
  dataStoreKey: "bankRoutingNumber",
  testValue: "123456789",
});
export const bankAccountNumberField = createTestField({
  name: "Bank account number *",
  required: true,
  dataStoreKey: "bankAccountNumber",
  testValue: "11111111111",
});

export const oneNameAccountInformationFields = [
  nameOnBankAccountField,
  bankRoutingNumberField,
  bankAccountNumberField,
];
export const twoNamesAccountInformationFields = [
  nameOnBankAccountField,
  hasJointBankAccountField,
  secondNameOnJointBankAccountField,
  bankRoutingNumberField,
  bankAccountNumberField,
];

export const path1TestFields = [...directDepositDetailsFields, ...oneNameAccountInformationFields];
export const path2TestFields = [...directDepositDetailsFields, ...twoNamesAccountInformationFields];
