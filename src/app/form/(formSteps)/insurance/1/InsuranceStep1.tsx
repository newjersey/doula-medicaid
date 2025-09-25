"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { formatFormProgressUrl, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const FormSection = () => {
  const navigate = useNavigate();
  const formProgressPosition = useFormProgressPosition();
  const { handleSubmit } = useForm<object>({
    defaultValues: {},
  });
  return (
    <div>
      <Form
        onSubmit={handleSubmit(() => {
          if (formProgressPosition.next !== null) {
            navigate(formatFormProgressUrl(formProgressPosition.next));
          }
        })}
        className="maxw-full"
      >
        <HorizontalDivider />
        <FormProgressButtons />
      </Form>
    </div>
  );
};

export default FormSection;
