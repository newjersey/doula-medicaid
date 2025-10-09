import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const yesIsSoleProprietor: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

export const noIsSoleProprietor: TestField = createTestField({
  name: "No",
  dataStoreKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

export const testFields: Array<TestField> = [yesIsSoleProprietor];
