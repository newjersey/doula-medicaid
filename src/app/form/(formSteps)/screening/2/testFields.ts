import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

const noEverHadEmployees = createTestField({
  name: "No",
  role: "radio",
  required: true,
  dataStoreKey: "everHadEmployees",
  testValue: "false",
  withinGroupName: "Have you ever had employees in your doula business? Select one *",
});
export const yesEverHadEmployees = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  dataStoreKey: "everHadEmployees",
  testValue: "true",
  withinGroupName: "Have you ever had employees in your doula business? Select one *",
});

const noEverHadOtherBusinessOwner = createTestField({
  name: "No",
  role: "radio",
  required: true,
  dataStoreKey: "everHadOtherBusinessOwner",
  testValue: "false",
  withinGroupName: "Did anyone other than you ever own a percentage of your business? Select one *",
});
export const yesEverHadOtherBusinessOwner = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  dataStoreKey: "everHadOtherBusinessOwner",
  testValue: "true",
  withinGroupName: "Did anyone other than you ever own a percentage of your business? Select one *",
});

export const testFields: Array<TestField> = [noEverHadEmployees, noEverHadOtherBusinessOwner];
