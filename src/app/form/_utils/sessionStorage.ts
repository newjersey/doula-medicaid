import type { BusinessDetails1Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import type {
  PersonalDetails1Data,
  PersonalDetails2Data,
  PersonalDetails3Data,
} from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";

type SessionStorageKey =
  | keyof PersonalDetails1Data
  | keyof PersonalDetails2Data
  | keyof PersonalDetails3Data
  | keyof BusinessDetails1Data;

export const setKeyValue = (key: SessionStorageKey, value: string): void => {
  window.sessionStorage.setItem(key, value);
};

export const getValue = (key: SessionStorageKey): string | null => {
  if (typeof window !== "undefined") {
    return window.sessionStorage.getItem(key);
  }
  return null;
};

export const removeKey = (key: SessionStorageKey): void => {
  window.sessionStorage.removeItem(key);
};
