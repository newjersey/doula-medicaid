"use client";

import { setKeyValue } from "@/app/form/_utils/sessionStorage";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Fieldset, Form, Radio } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

interface DisclosuresData {
  hadBreakfast: "true" | "false" | "";
  breakfastWasTasty: "true" | "false" | "";
}

const DisclosuresStep: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { register, handleSubmit, watch } = useForm<DisclosuresData>({
    defaultValues: {
      hadBreakfast: "",
      breakfastWasTasty: "",
    },
  });
  const hadBreakfast = watch("hadBreakfast");
  const breakfastWasTasty = watch("breakfastWasTasty");

  const onSubmit: SubmitHandler<DisclosuresData> = (data) => {
    let key: keyof DisclosuresData;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full">
        <div className="maxw-tablet">
          <h2 className="font-heading-md">Breakfast information</h2>
          <p>Have you had breakfast today?</p>
          <Fieldset legend={<p className="font-ui-xs">Select one</p>} legendStyle="default">
            <Radio
              id="hadBreakfastYes"
              data-testid="hadBreakfastYes"
              label="Yes"
              value="true"
              {...register("hadBreakfast")}
            />
            <Radio
              id="hadBreakfastNo"
              data-testid="hadBreakfastNo"
              label="No"
              value="false"
              {...register("hadBreakfast")}
            />
          </Fieldset>

          {hadBreakfast === "true" && (
            <div className="padding-y-4">
              <p>Was your breakfast tasty?</p>
              <Fieldset legend={<p className="font-ui-xs">Select one</p>} legendStyle="default">
                <Radio
                  id="breakfastYes"
                  label="Yes"
                  value="true"
                  {...register("breakfastWasTasty")}
                />
                <Radio
                  id="breakfastNo"
                  label="No"
                  value="false"
                  {...register("breakfastWasTasty")}
                />
              </Fieldset>
              {breakfastWasTasty !== "" && (
                <div className="padding-y-4">{breakfastWasTasty === "true" ? "Yay!" : "Boo"}</div>
              )}
            </div>
          )}
        </div>
        <FormProgressButtons />
      </Form>
    </div>
  );
};

export default DisclosuresStep;
