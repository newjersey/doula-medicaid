import { getCurrentFormProgress } from "./formProgress";

describe("getCurrentFormProgress", () => {
  it("returns the correct step when the path has no steps", () => {
    const currentFormProgress = getCurrentFormProgress("/form/download");
    expect(currentFormProgress).toEqual({
      section: { id: "download", progressBarTitle: "Download forms", heading: "Download forms" },
    });
  });

  it("returns the correct step when the path has steps", () => {
    const currentFormProgress = getCurrentFormProgress("/form/personal-details/2");
    expect(currentFormProgress).toEqual({
      section: {
        id: "personal-details",
        progressBarTitle: "Personal details",
        heading: "Personal details",
        numSteps: 3,
      },
      step: 2,
    });
  });
});
