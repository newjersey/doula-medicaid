"use client";

import React, { useContext } from "react";
import { FormContext } from "../../FormContext";
// import PracticeInformationStep from "../[stepId]/PracticeInformationStep";

// const stepIdToComponent = {
//   "practice-information": PracticeInformationStep,
// };

const FormStep: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formData, setFormData } = useContext(FormContext);

  console.log("here");
  return (
    <div>
      {/* {stepId in stepIdToComponent && stepIdToComponent[stepId]} */}
      {JSON.stringify(formData)}
    </div>
  );
};

export default FormStep;
