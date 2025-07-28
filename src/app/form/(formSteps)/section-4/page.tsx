"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const FormStep: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { handleSubmit } = useForm<object>({
    defaultValues: {},
  });
  return (
    <div>
      <Form
        onSubmit={handleSubmit(() => {
          routeToNextStep(router, formProgressPosition);
        })}
        className="maxw-full"
      >
        <FormProgressButtons />
      </Form>
    </div>
  );
};

export default FormStep;
