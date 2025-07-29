import { FormLayout } from "@form/(formSteps)/FormLayout";
import { getCurrentFormProgress } from "@form/_utils/formProgress";
import type { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") as string;
  const { section, step } = getCurrentFormProgress(pathname);
  let title = section.heading;
  if (step !== undefined) {
    title += ` ${step} of ${section.numSteps}`;
  }
  return {
    title,
  };
};

const FormLayoutWithRequestContext = async ({ children }: { children?: React.ReactNode }) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") as string;

  return <FormLayout pathname={pathname}>{children}</FormLayout>;
};

export default FormLayoutWithRequestContext;
