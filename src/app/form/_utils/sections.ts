export interface Section {
  id: string;
  sectionName: string;
  heading: string;
  numSteps?: number;
}

export interface Step {
  section: Section;
  stepNum: number | null;
}

export const allSections: Array<Section> = [
  {
    id: "personal-details",
    sectionName: "Personal details",
    heading: "Personal details",
    numSteps: 3,
  },
  {
    id: "disclosures",
    sectionName: "Disclosures",
    heading: "Disclosure of ownership",
    numSteps: 1,
  },
  {
    id: "download",
    sectionName: "Download forms",
    heading: "Download forms",
  },
];

export const getCurrentStep = (pathname: string): Step => {
  const pathParts = pathname.split("/");
  if (pathParts[0] !== "" || pathParts[1] !== "form") {
    throw new Error(`Unexpected route ${pathname}`);
  }
  const currentSection = allSections.find((section) => pathParts[2].endsWith(section.id));
  if (currentSection === undefined) {
    throw new Error(`Section not found for ${pathname}`);
  }

  let stepNum = null;
  if (currentSection.numSteps !== undefined) {
    const pathStep = Number(pathParts[3]);

    if (new Set([...Array(currentSection.numSteps + 1).keys()].slice(1)).has(pathStep)) {
      stepNum = pathStep;
    } else {
      throw new Error(`Substep not found for ${pathname}`);
    }
  }
  return { section: currentSection, stepNum: stepNum };
};
