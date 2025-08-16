"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { setKeyValue } from "@form/_utils/sessionStorage";
import { Fieldset, Form, RequiredMarker, Select } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import DoulaExplainer from "./DoulaTrainingExplainer";
import type { TrainingDetailsData } from "./TrainingDetailsData";

const FormSection = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { register, handleSubmit } = useForm<TrainingDetailsData>({
    defaultValues: {
      isTrainingOnList: "",
      stateApprovedTraining: null,
      nameOfTrainingOrganization: null,
    },
  });

  // const isTrainingOnList = watch("isTrainingOnList");

  const onSubmit: SubmitHandler<TrainingDetailsData> = (data) => {
    let key: keyof TrainingDetailsData;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full">
          <div className="form-grid">
            <div>
              <h2 className="font-heading-md margin-top-0">Doula training organization</h2>
              <Fieldset
                legend={
                  <div>
                    <p className="font-ui-xs text-normal">
                      Which state-approved training did you complete?
                    </p>
                    <p className="font-ui-xs text-normal">
                      Select one <RequiredMarker />
                    </p>
                  </div>
                }
                legendStyle="large"
              >
                <Select id="input-select" name="input-select">
                  <option>- Select - </option>
                  <option value="value1">Option A</option>
                  <option value="value2">Option B</option>
                  <option value="value3">Option C</option>
                  <option value="valueBIG">
                    Option of extra length to demonstrate how content like this will look different
                  </option>
                </Select>
              </Fieldset>
            </div>
            <div className="form-explainer">
              <DoulaExplainer />
            </div>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default FormSection;
