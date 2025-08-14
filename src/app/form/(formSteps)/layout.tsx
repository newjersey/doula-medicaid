import { FormLayout } from "@form/(formSteps)/FormLayout";
import { headers } from "next/headers";
import React from "react";

const FormLayoutWithRequestContext = async ({ children }: { children?: React.ReactNode }) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") as string;

  return <FormLayout pathname={pathname}>{children}</FormLayout>;
};

export default FormLayoutWithRequestContext;
