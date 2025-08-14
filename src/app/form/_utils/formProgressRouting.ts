"use client";

import {
  allSections,
  getCurrentFormProgress,
  getNextFormProgress,
  getPreviousFormProgress,
  type FormProgress,
} from "@form/_utils/formProgress";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";

interface FormProgressPosition {
  previous: FormProgress | null;
  current: FormProgress;
  next: FormProgress | null;
}

export const useFormProgressPosition = (): FormProgressPosition => {
  const pathname = usePathname();
  const current = getCurrentFormProgress(pathname);
  const next = getNextFormProgress(current, allSections);
  const previous = getPreviousFormProgress(current, allSections);
  return { current, next, previous };
};

export const routeToNextStep = (
  router: AppRouterInstance,
  formProgressPosition: FormProgressPosition,
) => {
  if (formProgressPosition.next !== null) {
    router.push(formatFormProgressUrl(formProgressPosition.next));
    router.refresh();
  }
};

export const formatFormProgressUrl = (formProgress: FormProgress) => {
  return `/form/${formProgress.section.id}`;
};
