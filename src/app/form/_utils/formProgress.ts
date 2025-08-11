export interface Section {
  id: string;
  progressBarTitle: string;
  heading: string;
  numSteps?: number;
}

export interface FormProgress {
  section: Section;
  step?: number;
}
export const allSections: Array<Section> = [
  {
    id: "screening",
    progressBarTitle: "Screening",
    heading: "Screening",
  },
  {
    id: "insurance",
    progressBarTitle: "Insurance",
    heading: "Insurance",
  },
  {
    id: "training",
    progressBarTitle: "Training",
    heading: "Training",
  },
  {
    id: "personal-details",
    progressBarTitle: "Personal details",
    heading: "Personal details",
    numSteps: 3,
  },
  {
    id: "business-details",
    progressBarTitle: "Business details",
    heading: "Business details",
    numSteps: 1,
  },
  {
    id: "finish",
    progressBarTitle: "Finish",
    heading: "Download forms",
  },
];

export const getCurrentFormProgress = (pathname: string): FormProgress => {
  const pathParts = pathname.split("/");
  if (pathParts[0] !== "" || pathParts[1] !== "form") {
    throw new Error(`Unexpected route ${pathname}`);
  }
  const currentSection = allSections.find((section) => pathParts[2].endsWith(section.id));
  if (currentSection === undefined) {
    throw new Error(`Section not found for ${pathname}`);
  }

  if (currentSection.numSteps === undefined) {
    return { section: currentSection };
  } else {
    const pathStep = Number(pathParts[3]);

    if (!new Set([...Array(currentSection.numSteps + 1).keys()].slice(1)).has(pathStep)) {
      throw new Error(`Substep not found for ${pathname}`);
    }
    return { section: currentSection, step: pathStep };
  }
};

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
