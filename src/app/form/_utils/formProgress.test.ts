import {
  getCurrentFormProgress,
  getNextFormProgress,
  getPreviousFormProgress,
} from "@form/_utils/formProgress";

describe("getCurrentFormProgress", () => {
  it("returns the correct step when the path has no steps", () => {
    const currentFormProgress = getCurrentFormProgress("/form/finish");
    expect(currentFormProgress).toEqual({
      section: { id: "finish", progressBarTitle: "Finish", heading: "Download forms" },
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

describe("getNextFormProgress", () => {
  it("returns null when the current section has no steps and is the last one", () => {
    const section = { id: "section1", progressBarTitle: "Section 1", heading: "Section 1" };
    const allSections = [section];
    const currentFormProgress = {
      section,
    };
    expect(getNextFormProgress(currentFormProgress, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the last one", () => {
    const section = {
      id: "section1",
      progressBarTitle: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const currentFormProgress = {
      section,
      step: 2,
    };
    expect(getNextFormProgress(currentFormProgress, allSections)).toEqual(null);
  });
});

describe("getPreviousFormProgress", () => {
  it("returns null when the current section has no steps and is the first one", () => {
    const section = { id: "section1", progressBarTitle: "Section 1", heading: "Section 1" };
    const allSections = [section];
    const currentFormProgress = {
      section,
    };
    expect(getPreviousFormProgress(currentFormProgress, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the first one", () => {
    const section = {
      id: "section1",
      progressBarTitle: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const currentFormProgress = {
      section,
      step: 1,
    };
    expect(getPreviousFormProgress(currentFormProgress, allSections)).toEqual(null);
  });
});

describe("getNextStep and getPreviousStep", () => {
  it("gets the correct next and previous steps when transitioning within a section", () => {
    const section = {
      id: "section1",
      progressBarTitle: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const firstFormProgress = {
      section,
      step: 1,
    };
    const secondFormProgress = {
      section,
      step: 2,
    };

    expect(getNextFormProgress(firstFormProgress, allSections)).toEqual(secondFormProgress);
    expect(getPreviousFormProgress(secondFormProgress, allSections)).toEqual(firstFormProgress);
  });

  it.each([
    {
      name: "both the first and second sections have no steps",
      firstFormProgress: {
        section: { id: "section1", progressBarTitle: "Section 1", heading: "Section 1" },
      },
      secondFormProgress: {
        section: { id: "section2", progressBarTitle: "Section 2", heading: "Section 2" },
      },
    },
    {
      name: "the first section has no steps and the second section has steps",
      firstFormProgress: {
        section: { id: "section1", progressBarTitle: "Section 1", heading: "Section 1" },
      },
      secondFormProgress: {
        section: {
          id: "section2",
          progressBarTitle: "Section 2",
          heading: "Section 2",
          numSteps: 3,
        },
        step: 1,
      },
    },
    {
      name: "the first section has steps and the second section has no steps",
      firstFormProgress: {
        section: {
          id: "section1",
          progressBarTitle: "Section 1",
          heading: "Section 1",
          numSteps: 3,
        },
        step: 3,
      },
      secondFormProgress: {
        section: { id: "section2", progressBarTitle: "Section 2", heading: "Section 2" },
      },
    },
    {
      name: "both the first and second section have steps",
      firstFormProgress: {
        section: {
          id: "section1",
          progressBarTitle: "Section 1",
          heading: "Section 1",
          numSteps: 3,
        },
        step: 3,
      },
      secondFormProgress: {
        section: {
          id: "section2",
          progressBarTitle: "Section 2",
          heading: "Section 2",
          numSteps: 3,
        },
        step: 1,
      },
    },
  ])(
    "gets the correct next and previous steps when transitioning between sections and $name",
    ({ firstFormProgress, secondFormProgress }) => {
      const allSections = [firstFormProgress.section, secondFormProgress.section];
      expect(getNextFormProgress(firstFormProgress, allSections)).toEqual(secondFormProgress);
      expect(getPreviousFormProgress(secondFormProgress, allSections)).toEqual(firstFormProgress);
    },
  );
});
