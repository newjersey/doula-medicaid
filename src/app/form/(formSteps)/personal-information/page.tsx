"use client";

import { useParams } from "next/navigation";
import React from "react";
// import PracticeInformationStep from "../[stepId]/PracticeInformationStep";

// const stepIdToComponent = {
//   "practice-information": PracticeInformationStep,
// };

const FormStep: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();

  console.log("here");
  return (
    <div>
      {/* {stepId in stepIdToComponent && stepIdToComponent[stepId]} */}
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  );
};

export default FormStep;
