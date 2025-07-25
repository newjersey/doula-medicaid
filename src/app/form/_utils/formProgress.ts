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
    id: "personal-details",
    progressBarTitle: "Personal details",
    heading: "Personal details",
    numSteps: 3,
  },
  {
    id: "disclosures",
    progressBarTitle: "Disclosures",
    heading: "Disclosure of ownership",
    numSteps: 1,
  },
  {
    id: "step-3",
    progressBarTitle: "Step 3",
    heading: "Placeholder step 3",
  },
  {
    id: "step-4",
    progressBarTitle: "Step 4",
    heading: "Placeholder step 4",
  },
  {
    id: "step-5",
    progressBarTitle: "Step 5",
    heading: "Placeholder step 5",
  },
  {
    id: "download",
    progressBarTitle: "Download forms",
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
