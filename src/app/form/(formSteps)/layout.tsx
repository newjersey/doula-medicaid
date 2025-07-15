"use client";

import React from "react";

import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import { usePathname, useRouter } from "next/navigation";

const steps = [
  { id: "personal-information", stepName: "Personal Information", title: "Personal information" },
  { id: "disclosures", stepName: "Disclosures", title: "Disclosures" },
  {
    id: "review",
    stepName: "Review",
    title: "Review and download.",
  },
];

type CompletionState = "complete" | "current" | "incomplete";

const FormLayout: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = steps.map((x) => x.id).findIndex((stepId) => pathname.endsWith(stepId));
  if (currentStepIndex < 0) {
    throw new Error(`Step not found for ${pathname}`);
  }

  const currentStep = steps[currentStepIndex];
  const isFinalStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="usa-step-indicator form-container" aria-label="progress">
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
      <div className="right-align">
        <ButtonGroup type="default">
          {!isFirstStep && (
            <Link href={steps[currentStepIndex - 1].id} className="usa-button usa-button--outline">
              Previous
            </Link>
          )}
          {!isFinalStep && (
            <Button
              type="button"
              onClick={() => {
                router.push(steps[currentStepIndex + 1].id);
                router.refresh();
              }}
            >
              Next
            </Button>
          )}
        </ButtonGroup>
      </div>
      <div className="margin-top-4">Step {currentStepIndex + 1}</div>
      <h1 className="margin-top-4">{currentStep.title}</h1>
      <div className="margin-top-4">{children}</div>
    </div>
  );
};

export default FormLayout;
