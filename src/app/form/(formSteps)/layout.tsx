import type { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";
import { getCurrentStep } from "../_utils/sections";
import { FormLayout } from "./FormLayout";

export const generateMetadata = async (): Promise<Metadata> => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") as string;
  const { section, stepNum: stepNum } = getCurrentStep(pathname);
  let title = section.heading;
  if (stepNum !== null) {
    title += ` ${stepNum} of ${section.numSteps}`;
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
