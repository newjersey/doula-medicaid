import type {
  Insurance1Data,
  Insurance2Data,
} from "@/app/form/(formSteps)/insurance/InsuranceData";
import type {
  Screening1Data,
  Screening2Data,
  Screening3Data,
} from "@/app/form/(formSteps)/screening/ScreeningData";
import type { TrainingData } from "@/app/form/(formSteps)/training/TrainingData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";
import type {
  BusinessAddressSameAsOtherAddressOptions,
  BusinessDetails1Data,
  BusinessDetails2Data,
  BusinessDetails3Data,
  BusinessDetails4Data,
} from "@form/(formSteps)/business-details/BusinessDetailsData";
import type {
  PersonalDetails1Data,
  PersonalDetails2Data,
  PersonalDetails3Data,
} from "@form/(formSteps)/personal-details/PersonalDetailsData";

export type DataStoreKey =
  | keyof Screening1Data
  | keyof Screening2Data
  | keyof Screening3Data
  | keyof Insurance1Data
  | keyof Insurance2Data
  | keyof TrainingData
  | keyof PersonalDetails1Data
  | keyof PersonalDetails2Data
  | keyof PersonalDetails3Data
  | keyof BusinessDetails1Data
  | keyof BusinessDetails2Data
  | keyof BusinessDetails3Data
  | keyof BusinessDetails4Data;

export type DataStore = { [key: string]: string };

export class ValueNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValueNotFoundError";
  }
}

export function getValue(dataStore: DataStore, key: DataStoreKey, required: true): string;
export function getValue(dataStore: DataStore, key: DataStoreKey, required: false): string | null;
export function getValue(dataStore: DataStore, key: DataStoreKey, required: boolean): string | null;
export function getValue(
  dataStore: DataStore,
  key: DataStoreKey,
  required: boolean,
): string | null {
  if (required) {
    if (dataStore[key] === undefined) {
      throw new ValueNotFoundError(`${key} is unexpectedly null`);
    }
    return dataStore[key];
  } else {
    return dataStore[key] ?? null;
  }
}

export function getBoolean(dataStore: DataStore, key: DataStoreKey, required: true): boolean;
export function getBoolean(
  dataStore: DataStore,
  key: DataStoreKey,
  required: false,
): boolean | null;
export function getBoolean(
  dataStore: DataStore,
  key: DataStoreKey,
  required: boolean,
): boolean | null;
export function getBoolean(
  dataStore: DataStore,
  key: DataStoreKey,
  required: boolean,
): boolean | null {
  const value = getValue(dataStore, key, required);
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${key}, ${value}`);
}

export const getDefaultValue = (dataStore: DataStore, key: DataStoreKey) =>
  getValue(dataStore, key, false);
/**
  getDefaultBoolean returns a string because it's used to populate the `defaultValues` in useForm. Even though our two options are yes/no, radio button values require a string.
 */
export const getDefaultBoolean = (
  dataStore: DataStore,
  key: DataStoreKey,
): "" | "true" | "false" => {
  const value = getValue(dataStore, key, false);
  if (value === null) return "";
  if (value === "true" || value === "false") return value;
  throw new Error(`Invalid boolean string value: ${key}, ${value}`);
};

export function getAddressState(
  dataStore: DataStore,
  key: DataStoreKey,
  required: true,
): AddressState;
export function getAddressState(
  dataStore: DataStore,
  key: DataStoreKey,
  required: false,
): AddressState | null;
export function getAddressState(
  dataStore: DataStore,
  key: DataStoreKey,
  required: boolean,
): AddressState | null;
export function getAddressState(
  dataStore: DataStore,
  key: DataStoreKey,
  required: boolean,
): AddressState | null {
  const value = getValue(dataStore, key, required);
  if (value === null) return null;
  if (Object.values<string>(AddressState).includes(value)) {
    return AddressState[value as keyof typeof AddressState];
  }
  throw new Error(`Invalid AddressState value: ${key}, ${value}`);
}

export function getBusinessAddressSameAsOtherAddress(
  dataStore: DataStore,
  required: true,
): BusinessAddressSameAsOtherAddressOptions;
export function getBusinessAddressSameAsOtherAddress(
  dataStore: DataStore,
  required: false,
): BusinessAddressSameAsOtherAddressOptions | null;
export function getBusinessAddressSameAsOtherAddress(
  dataStore: DataStore,
  required: boolean,
): BusinessAddressSameAsOtherAddressOptions | null;
export function getBusinessAddressSameAsOtherAddress(
  dataStore: DataStore,
  required: boolean,
): BusinessAddressSameAsOtherAddressOptions | null {
  const value = getValue(dataStore, "businessAddressSameAsOtherAddress", required);
  if (value === null) return "";
  if (value === "mailing" || value === "billing" || value === "different") return value;
  throw new Error(`Invalid value for businessAddressSameAsOtherAddress: ${value}`);
}
