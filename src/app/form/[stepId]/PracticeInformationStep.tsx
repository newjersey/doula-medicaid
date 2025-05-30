"use client";

import { useParams } from "next/navigation";
import React, { useContext } from "react";
import { FormContext } from "../FormContext";

const PracticeInformationStep: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const { formData, setFormData } = useContext(FormContext);
  // const currentStepIndex = steps.map((x) => x.id).indexOf(stepId);
  // if (currentStepIndex < 0) {
  //   return notFound();
  // }

  //   const currentStep = steps[currentStepIndex];
  console.log("here");
  return (
    <div className="usa-step-indicator" aria-label="progress">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  );
};

export default PracticeInformationStep;
