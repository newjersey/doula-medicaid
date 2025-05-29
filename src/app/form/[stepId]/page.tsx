import React from "react";

// const steps = [
//   { id: "personal-information", displayName: "Personal Information" },
//   { id: "practice-information", displayName: "Practice Information" },
//   { id: "disclosures", displayName: "Disclosures" },
//   { id: "aetna", displayName: "Aetna Application" },
// ];

// // I have no idea of this static page generation is actually working
// export function generateStaticParams() {
//   return [
//     steps.map((x) => {
//       return { stepId: x.id };
//     }),
//   ];
// }

const Step: React.FC = async ({ params }: { params: Promise<{ stepId: string }> }) => {
  const { stepId } = await params;
  // const currentStepIndex = steps.map((x) => x.id).indexOf(stepId);
  // if (currentStepIndex < 0) {
  //   return notFound();
  // }

  //   const currentStep = steps[currentStepIndex];

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

export default Step;
