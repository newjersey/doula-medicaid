import type { TrainingData } from "@/app/form/(formSteps)/training/TrainingData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";
import type { BusinessDetails1Data } from "@form/(formSteps)/business-details/BusinessDetailsData";
import type {
  PersonalDetails1Data,
  PersonalDetails2Data,
  PersonalDetails3Data,
} from "@form/(formSteps)/personal-details/PersonalDetailsData";

export type SessionStorageKey =
  | keyof TrainingData
  | keyof PersonalDetails1Data
  | keyof PersonalDetails2Data
  | keyof PersonalDetails3Data
  | keyof BusinessDetails1Data;

export const setKeyValue = (key: SessionStorageKey, value: string): void => {
  window.sessionStorage.setItem(key, value);
};

export function getValue(key: SessionStorageKey, required: true): string;
export function getValue(key: SessionStorageKey, required: false): string | null;
export function getValue(key: SessionStorageKey, required: boolean): string | null;
export function getValue(key: SessionStorageKey, required: boolean): string | null {
  const value = window.sessionStorage.getItem(key);
  if (required) {
    if (value === null) {
      throw new Error(`${key} is unexpectedly null`);
    }
    return value;
  } else {
    return value;
  }
}

export function getBoolean(key: SessionStorageKey, required: true): boolean;
export function getBoolean(key: SessionStorageKey, required: false): boolean | null;
export function getBoolean(key: SessionStorageKey, required: boolean): boolean | null;
export function getBoolean(key: SessionStorageKey, required: boolean): boolean | null {
  const value = getValue(key, required);
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${key} ${value}`);
}

export function getAddressState(key: SessionStorageKey, required: true): AddressState;
export function getAddressState(key: SessionStorageKey, required: false): AddressState | null;
export function getAddressState(key: SessionStorageKey, required: boolean): AddressState | null;
export function getAddressState(key: SessionStorageKey, required: boolean): AddressState | null {
  const value = getValue(key, required);
  if (value === null) return null;
  if (Object.values<string>(AddressState).includes(value)) {
    return AddressState[value as keyof typeof AddressState];
  }
  throw new Error(`Invalid AddressState value: ${key} ${value}`);
}
