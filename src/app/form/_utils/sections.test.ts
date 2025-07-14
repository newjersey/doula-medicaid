import { getCurrentStep } from "./sections";

describe("getCurrentStep", () => {
  it("returns the correct step when the path has no steps", () => {
    const currentStep = getCurrentStep("/form/download");
    expect(currentStep).toEqual({
      section: { id: "download", sectionName: "Download forms", heading: "Download forms" },
      stepNum: null,
    });
  });

  it("returns the correct step when the path has steps", () => {
    const currentStep = getCurrentStep("/form/personal-details/2");
    expect(currentStep).toEqual({
      section: {
        id: "personal-details",
        sectionName: "Personal details",
        heading: "Personal details",
        numSteps: 3,
      },
      stepNum: 2,
    });
  });
});
