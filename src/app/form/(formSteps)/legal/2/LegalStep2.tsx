"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const mayHaveThreeOrMoreErrors = false;
const LegalStep2 = () => {
  const {
    formState: { errors },
    handleSubmit,
  } = useForm<object>({
    defaultValues: {},
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  return (
    <DoulaForm<object>
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default LegalStep2;
