"use client";

import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import { usePathname, useRouter } from "next/navigation";
import {
  allSections,
  getCurrentFormProgress,
  type FormProgress,
  type Section,
} from "../../_utils/formProgress";

interface ProgressButtonsProps {
  onClickHandler?: () => Promise<void> | void;
}

export const getNextFormProgress = (
  currentStep: FormProgress,
  allSections: Array<Section>,
): FormProgress | null => {
  if (
    currentStep.section.numSteps !== undefined &&
    currentStep.step !== undefined &&
    currentStep.step < currentStep.section.numSteps
  ) {
    // Increment step
    return {
      section: currentStep.section,
      step: currentStep.step + 1,
    };
  } else {
    // Increment section
    const currentSectionIndex = allSections.findIndex(
      (section) => section.id === currentStep.section.id,
    );
    const isFinalStep = currentSectionIndex === allSections.length - 1;
    if (isFinalStep) {
      return null;
    }
    const nextSectionIndex = currentSectionIndex + 1;
    return {
      section: allSections[nextSectionIndex],
      ...(allSections[nextSectionIndex].numSteps !== undefined && { step: 1 }),
      // step: allSteps[nextSectionIndex].numSteps === undefined ? null : 1,
    };
  }
};

export const getPreviousFormProgress = (
  currentStep: FormProgress,
  allSections: Array<Section>,
): FormProgress | null => {
  if (
    currentStep.section.numSteps !== undefined &&
    currentStep.step !== undefined &&
    currentStep.step > 1
  ) {
    // Decrement step
    return {
      section: currentStep.section,
      step: currentStep.step - 1,
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
    const nextSectionIndex = currentSectionIndex - 1;
    return {
      section: allSections[nextSectionIndex],
      ...(allSections[nextSectionIndex].numSteps !== undefined && {
        step: allSections[nextSectionIndex].numSteps,
      }),
    };
  }
};

export const formatFormProgressUrl = (formProgress: FormProgress) => {
  if (formProgress.step !== undefined) {
    return `/form/${formProgress.section.id}/${formProgress.step}`;
  } else {
    return `/form/${formProgress.section.id}`;
  }
};

const ProgressButtons: React.FC<ProgressButtonsProps> = ({ onClickHandler }) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = getCurrentFormProgress(pathname);
  const nextStep = getNextFormProgress(currentStep, allSections);
  const previousStep = getPreviousFormProgress(currentStep, allSections);

  const buttons: Array<React.ReactNode> = [];
  if (previousStep) {
    buttons.push(
      <Link
        key="previous"
        href={formatFormProgressUrl(previousStep)}
        className="usa-button  usa-button--outline"
        // TODO: https://github.com/newjersey/doula-pm/issues/30 If validation fails do not continue
        onClick={() => {
          onClickHandler?.();
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
        // TODO: https://github.com/newjersey/doula-pm/issues/30 If validation fails do not continue
        onClick={() => {
          onClickHandler?.();
          router.push(formatFormProgressUrl(nextStep));
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
