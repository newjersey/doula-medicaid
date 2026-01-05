import { createTestField, createTestFields } from "@/app/form/_utils/testUtils/sharedTests";

export const npiNumberField = createTestField({
  name: "National Provider Identifier (NPI) *",
  required: true,
  alternateRequiredFieldError:
    "To be an NJ FamilyCare doula, you need a NPI. You can get yours via https://nppes.cms.hhs.gov/. Enter your 10-digit NPI number.",
  dataStoreKey: "npiNumber",
  testValue: "1111111111",
});

export const doulaProviderIdentificationFields = [npiNumberField];

export const otherIdentificationFields = createTestFields([
  {
    name: "UPIN number (optional)",
    required: false,
    dataStoreKey: "upinNumber",
    testValue: "12345",
  },
  {
    name: "Medicare provider ID (optional)",
    required: false,
    dataStoreKey: "medicareProviderId",
    testValue: "ABC12345",
  },
]);

export const testFields = [...doulaProviderIdentificationFields, ...otherIdentificationFields];
