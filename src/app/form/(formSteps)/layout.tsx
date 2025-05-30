"use client";

import React, { useState } from "react";

import { useParams } from "next/navigation";
import { FormContext, FormData, initialFormData } from "../FormContext";

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

const FormLayout: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const params = useParams<{ stepId: string }>();
  console.log("test", params);
  const currentStepIndex = steps.map((x) => x.id).indexOf(stepId);
  if (currentStepIndex < 0) {
    // return notFound();
  }

  const currentStep = steps[currentStepIndex];
  const isFinalStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

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
      <div className="margin-top-4">
        <FormContext value={{ formData, setFormData }}>{children}</FormContext>
      </div>
      <div className="margin-top-4">
        <a
          className="usa-button usa-button--outline"
          href={isFirstStep ? "/" : `${steps[currentStepIndex - 1].id}`}
        >
          Back
        </a>
        <a className="usa-button" href={isFinalStep ? "/" : `${steps[currentStepIndex + 1].id}`}>
          {isFinalStep ? "Finish" : "Next"}
        </a>
      </div>
    </div>
  );
};

export default FormLayout;
