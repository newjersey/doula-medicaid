"use client";

import {
  getAllSections,
  getCurrentFormProgress,
  getNextFormProgress,
  getPreviousFormProgress,
  type FormProgress,
} from "@form/_utils/formProgress";
import { usePathname } from "next/navigation";

export interface FormProgressPosition {
  previous: FormProgress | null;
  current: FormProgress;
  next: FormProgress | null;
}

export const useFormProgressPosition = (): FormProgressPosition => {
  const pathname = usePathname();
  const current = getCurrentFormProgress(pathname);
  const next = getNextFormProgress(current, getAllSections());
  const previous = getPreviousFormProgress(current, getAllSections());
  return { current, next, previous };
};

export const formatFormProgressUrl = (formProgress: FormProgress) => {
  if (formProgress.step !== undefined) {
    return `/form/${formProgress.section.id}/${formProgress.step}`;
  } else {
    return `/form/${formProgress.section.id}`;
  }
};
