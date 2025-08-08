"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { setKeyValue } from "@form/_utils/sessionStorage";
import { Form } from "@trussworks/react-uswds";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const SignatureMaker = dynamic(
  () => import("@docuseal/signature-maker-react").then((mod) => ({ default: mod.SignatureMaker })),
  {
    ssr: false,
  },
);

const FormStep: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();

  const { handleSubmit } = useForm<object>({
    defaultValues: {},
  });

  const handleSignatureChange = (event: { base64: string | null }) => {
    if (event === undefined) return;
    setKeyValue("signature", event.base64 || "");
  };

  return (
    <div>
      <Form
        onSubmit={handleSubmit(() => {
          routeToNextStep(router, formProgressPosition);
        })}
        className="maxw-full"
      >
        <div className="maxw-tablet">
          <SignatureMaker withSubmit={false} onChange={handleSignatureChange} />
        </div>

        <FormProgressButtons />
      </Form>
    </div>
  );
};

export default FormStep;
