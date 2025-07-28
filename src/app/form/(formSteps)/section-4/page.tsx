"use client";

import { Form } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../_utils/formProgressRouting";
import FormProgressButtons from "../components/FormProgressButtons";

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
