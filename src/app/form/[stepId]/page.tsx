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
      page
    </div>
  );
};

export default Step;
