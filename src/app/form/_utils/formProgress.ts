export interface Section {
  id: string;
  progressBarTitle: string;
  heading: string;
}

export interface FormProgress {
  section: Section;
}
export const allSections: Array<Section> = [
  {
    id: "personal-information",
    progressBarTitle: "Personal information",
    heading: "Personal information",
  },
  {
    id: "disclosures",
    progressBarTitle: "Disclosures",
    heading: "Disclosures",
  },
  {
    id: "review",
    progressBarTitle: "Review",
    heading: "Review",
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

  return { section: currentSection };
};

export const getNextFormProgress = (
  currentStep: FormProgress,
  allSections: Array<Section>,
): FormProgress | null => {
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
  };
};

export const getPreviousFormProgress = (
  currentStep: FormProgress,
  allSections: Array<Section>,
): FormProgress | null => {
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
  };
};
