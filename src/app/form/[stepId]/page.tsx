import { notFound } from "next/navigation";
import React from "react";

const steps = [
  { id: "personal-information", displayName: "Personal Information" },
  { id: "practice-information", displayName: "Practice Information" },
  { id: "disclosures", displayName: "Disclosures" },
  { id: "aetna", displayName: "Aetna Application" },
];

// I have no idea of this static page generation is actually working
export function generateStaticParams() {
  return [
    steps.map((x) => {
      return { stepId: x.id };
    }),
  ];
}

type CompletionState = "complete" | "current" | "incomplete";

const getCompletionState = () => {};

const Step: React.FC = async ({ params }: { params: Promise<{ stepId: string }> }) => {
  const { stepId } = await params;
  const currentStepIndex = steps.map((x) => x.id).indexOf(stepId);
  if (currentStepIndex < 0) {
    return notFound();
  }

  //   const currentStep = steps[currentStepIndex];

  return (
    <div className="usa-step-indicator" aria-label="progress">
      <ol className="usa-step-indicator__segments">
        {steps.map((step, i) => {
          const completionState: CompletionState =
            i < currentStepIndex ? "complete" : i === currentStepIndex ? "current" : "incomplete";
          const liSegmentClassSuffix = {
            complete: "complete",
            current: "current",
            incomplete: null,
          }[completionState];
          const screenreaderStatus = {
            complete: "completed",
            current: null,
            incomplete: "not completed",
          }[completionState];

          return (
            <li
              key={step.id}
              className={`usa-step-indicator__segment ${liSegmentClassSuffix ? `usa-step-indicator__segment--${liSegmentClassSuffix}` : ""}`}
              {...(completionState === "current" && { "aria-current": "true" })}
            >
              <span className="usa-step-indicator__segment-label">
                {step.displayName}
                {screenreaderStatus && <span className="usa-sr-only">{screenreaderStatus}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="margin-top-4">Step {currentStepIndex + 1}</div>
    </div>
  );
};

export default Step;
