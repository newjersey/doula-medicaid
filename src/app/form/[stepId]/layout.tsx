"use client";

import { notFound } from "next/navigation";
import React from "react";

import { useParams } from "next/navigation";

const steps = [
  { id: "personal-information", stepName: "Personal Information", title: "Personal information" },
  { id: "practice-information", stepName: "Practice Information", title: "Practice information" },
  { id: "disclosures", stepName: "Disclosures", title: "Disclosures" },
  {
    id: "aetna",
    stepName: "Aetna Application",
    title:
      "Your Medicaid ID application is complete! You're just a few steps away from finishing your Aetna form.",
  },
];

type CompletionState = "complete" | "current" | "incomplete";

const Step: React.FC = ({ children }: { children: React.ReactNode }) => {
  // const { stepId } = await params;
  const { stepId } = useParams<{ stepId: string }>();
  const currentStepIndex = steps.map((x) => x.id).indexOf(stepId);
  if (currentStepIndex < 0) {
    return notFound();
  }

  const currentStep = steps[currentStepIndex];
  const isFinalStep = currentStepIndex === steps.length - 1;

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
                {step.stepName}
                {screenreaderStatus && <span className="usa-sr-only">{screenreaderStatus}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="margin-top-4">Step {currentStepIndex + 1}</div>
      <h1 className="margin-top-4">{currentStep.title}</h1>
      <div className="margin-top-4">{children}</div>
      <div className="margin-top-4">
        <a
          className="usa-button usa-button--big"
          href={isFinalStep ? "/" : `${steps[currentStepIndex + 1].id}`}
        >
          {isFinalStep ? "Finish" : "Next"}
        </a>
      </div>
    </div>
  );
};

export default Step;
