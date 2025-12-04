export interface Section {
  id: string;
  name: string;
  shouldShowProgressBar: boolean;
  shouldShowProgressHeadingAndRequiredMessage: boolean;
  numSteps?: number;
}

export interface FormProgress {
  section: Section;
  step?: number;
}
export const getProgressBarSections = (): Array<Section> => {
  return [
    {
      id: "screening",
      name: "Screening",
      numSteps: 3,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    },
    {
      id: "insurance",
      name: "Insurance",
      numSteps: 2,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    },
    {
      id: "training",
      name: "Training",
      numSteps: 1,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    },
    {
      id: "personal",
      name: "Personal",
      numSteps: 3,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    },
    {
      id: "business",
      name: "Business",
      numSteps: 4,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    },
    ...(process.env.NEXT_PUBLIC_FLAG_LEGAL === "1"
      ? [
          {
            id: "legal",
            name: "Legal",
            numSteps: 3,
            shouldShowProgressBar: true,
            shouldShowProgressHeadingAndRequiredMessage: true,
          },
        ]
      : []),
    {
      id: "review",
      name: "Review",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: false,
    },
  ];
};

export const getAllSections = (): Array<Section> => {
  return [
    {
      id: "welcome",
      name: "Welcome",
      shouldShowProgressBar: false,
      shouldShowProgressHeadingAndRequiredMessage: false,
    },
  ].concat(getProgressBarSections());
};

export const getCurrentFormProgress = (pathname: string): FormProgress => {
  const pathParts = pathname.split("/");
  if (pathParts[0] !== "" || pathParts[1] !== "form") {
    throw new Error(`Unexpected route ${pathname}`);
  }
  const currentSection = getAllSections().find((section) => pathParts[2].endsWith(section.id));
  if (currentSection === undefined) {
    throw new Error(`Section not found for ${pathname}`);
  }

  if (currentSection.numSteps === undefined) {
    return { section: currentSection };
  } else {
    const pathStep = Number(pathParts[3]);

    if (!new Set([...Array(currentSection.numSteps + 1).keys()].slice(1)).has(pathStep)) {
      throw new Error(`Step not found for ${pathname}`);
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
    const isFinalSection = currentSectionIndex === allSections.length - 1;
    if (isFinalSection) {
      return null;
    }
    const nextSectionIndex = currentSectionIndex + 1;
    return {
      section: allSections[nextSectionIndex],
      ...(allSections[nextSectionIndex].numSteps !== undefined && { step: 1 }),
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

export const isFinalFormProgress = (
  formProgress: FormProgress,
  allSections: Array<Section>,
): boolean => {
  const currentSectionIndex = allSections.findIndex(
    (section) => section.id === formProgress.section.id,
  );
  const isFinalSection = currentSectionIndex === allSections.length - 1;
  if (
    isFinalSection &&
    (formProgress.step === undefined || formProgress.step === formProgress.section.numSteps)
  ) {
    return true;
  }
  return false;
};
