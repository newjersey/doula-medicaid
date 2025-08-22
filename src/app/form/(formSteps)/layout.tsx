import { FormLayout } from "@form/(formSteps)/FormLayout";
import type { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "NJ Form Filler",
  };
};

const FormLayoutWithRequestContext = async ({ children }: { children?: React.ReactNode }) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") as string;

  return <FormLayout pathname={pathname}>{children}</FormLayout>;
};

export default FormLayoutWithRequestContext;
