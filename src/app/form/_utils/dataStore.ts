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
import { AddressState } from "@/app/form/_utils/inputFields/addressState";
import type {
  Business1Data,
  Business2Data,
  Business3Data,
  Business4Data,
  BusinessAddressSameAsOtherAddressOptions,
} from "@form/(formSteps)/business/BusinessData";
import type { Legal1Data, Legal2Data } from "@form/(formSteps)/legal/LegalData";
import type {
  Personal1Data,
  Personal2Data,
  Personal3Data,
} from "@form/(formSteps)/personal/PersonalData";

export type DataStoreKey =
  | keyof Screening1Data
  | keyof Screening2Data
  | keyof Screening3Data
  | keyof Insurance1Data
  | keyof Insurance2Data
  | keyof TrainingData
  | keyof Personal1Data
  | keyof Personal2Data
  | keyof Personal3Data
  | keyof Business1Data
  | keyof Business2Data
  | keyof Business3Data
  | keyof Business4Data
  | keyof Legal1Data
  | keyof Legal2Data;

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
 * GetDefaultBoolean returns a string because it's used to populate the `defaultValues` in useForm.
 * Even though our two options are yes/no, radio button values require a string.
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
