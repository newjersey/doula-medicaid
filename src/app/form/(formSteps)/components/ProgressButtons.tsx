"use client";

import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import { usePathname, useRouter } from "next/navigation";
import { allSections, getCurrentStep, type Section, type Step } from "../../_utils/sections";

interface ProgressButtonsProps {
  onClickHandler?: () => Promise<void> | void;
}

export const getNextStep = (currentStep: Step, allSteps: Array<Section>): Step | null => {
  if (
    currentStep.section.numSteps !== undefined &&
    currentStep.stepNum !== null &&
    currentStep.stepNum < currentStep.section.numSteps
  ) {
    // Increment step
    return {
      section: currentStep.section,
      stepNum: currentStep.stepNum + 1,
    };
  } else {
    // Increment section
    const currentSectionIndex = allSteps.findIndex(
      (section) => section.id === currentStep.section.id,
    );
    const isFinalStep = currentSectionIndex === allSteps.length - 1;
    if (isFinalStep) {
      return null;
    }
    const nextSectionIndex = currentSectionIndex + 1;
    return {
      section: allSteps[nextSectionIndex],
      stepNum: allSteps[nextSectionIndex].numSteps === undefined ? null : 1,
    };
  }
};

export const getPreviousStep = (currentStep: Step, allSections: Array<Section>): Step | null => {
  if (
    currentStep.section.numSteps !== undefined &&
    currentStep.stepNum !== null &&
    currentStep.stepNum > 1
  ) {
    // Decrement step
    return {
      section: currentStep.section,
      stepNum: currentStep.stepNum - 1,
    };
  } else {
    // Decrement section
    const currentSectionIndex = allSections.findIndex(
      (section) => section.id === currentStep.section.id,
    );
    const isFirstStep = currentSectionIndex === 0;
    if (isFirstStep) {
      return null;
    }
    const nextStepIndex = currentSectionIndex - 1;
    return {
      section: allSections[nextStepIndex],
      stepNum:
        allSections[nextStepIndex].numSteps === undefined
          ? null
          : allSections[nextStepIndex].numSteps,
    };
  }
};

export const formatStepUrl = (step: Step) => {
  if (step.stepNum !== null) {
    return `/form/${step.section.id}/${step.stepNum}`;
  } else {
    return `/form/${step.section.id}`;
  }
};

const ProgressButtons: React.FC<ProgressButtonsProps> = ({ onClickHandler }) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = getCurrentStep(pathname);
  const nextStep = getNextStep(currentStep, allSections);
  const previousStep = getPreviousStep(currentStep, allSections);

  const buttons: Array<React.ReactNode> = [];
  if (previousStep) {
    buttons.push(
      <Link
        key="previous"
        href={formatStepUrl(previousStep)}
        className="usa-button  usa-button--outline"
        onClick={async () => {
          if (onClickHandler) {
            await onClickHandler();
          }
        }}
      >
        Previous
      </Link>,
    );
  }
  if (nextStep) {
    buttons.push(
      <Button
        key="next"
        type="button"
        onClick={async () => {
          if (onClickHandler) {
            await onClickHandler();
          }
          router.push(formatStepUrl(nextStep));
          router.refresh();
        }}
      >
        Next
      </Button>,
    );
  }

  return (
    <>
      <div className="margin-top-4 display-flex flex-column flex-align-end">
        <ButtonGroup type="default">{buttons}</ButtonGroup>
      </div>
    </>
  );
};

export default ProgressButtons;
