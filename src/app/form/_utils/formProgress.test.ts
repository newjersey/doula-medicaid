import {
  getCurrentFormProgress,
  getNextFormProgress,
  getPreviousFormProgress,
  isFinalFormProgress,
} from "@form/_utils/formProgress";

describe("getCurrentFormProgress", () => {
  it("returns the correct step when the path has no steps", () => {
    const currentFormProgress = getCurrentFormProgress("/form/review");
    expect(currentFormProgress).toEqual({
      section: {
        id: "review",
        name: "Review",
        shouldShowProgressBar: true,
        shouldShowProgressHeadingAndRequiredMessage: false,
      },
    });
  });

  it("returns the correct step when the path has steps", () => {
    const currentFormProgress = getCurrentFormProgress("/form/personal/2");
    expect(currentFormProgress).toEqual({
      section: {
        id: "personal",
        name: "Personal",
        numSteps: 4,
        shouldShowProgressBar: true,
        shouldShowProgressHeadingAndRequiredMessage: true,
      },
      step: 2,
    });
  });
});

describe("getNextFormProgress", () => {
  it("returns null when the current section has no steps and is the last one", () => {
    const section = {
      id: "section1",
      name: "Section 1",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    };
    const allSections = [section];
    const currentFormProgress = {
      section,
    };
    expect(getNextFormProgress(currentFormProgress, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the last one", () => {
    const section = {
      id: "section1",
      name: "Section 1",
      numSteps: 2,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
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
    const section = {
      id: "section1",
      name: "Section 1",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    };
    const allSections = [section];
    const currentFormProgress = {
      section,
    };
    expect(getPreviousFormProgress(currentFormProgress, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the first one", () => {
    const section = {
      id: "section1",
      name: "Section 1",
      numSteps: 2,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    };
    const allSections = [section];
    const currentFormProgress = {
      section,
      step: 1,
    };
    expect(getPreviousFormProgress(currentFormProgress, allSections)).toEqual(null);
  });
});

describe("getNextFormProgress and getPreviousFormProgress", () => {
  it("gets the correct next and previous form progress when transitioning within a section", () => {
    const section = {
      id: "section1",
      name: "Section 1",
      numSteps: 2,
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
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
        section: {
          id: "section1",
          name: "Section 1",
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
      },
      secondFormProgress: {
        section: {
          id: "section2",
          name: "Section 2",
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
      },
    },
    {
      name: "the first section has no steps and the second section has steps",
      firstFormProgress: {
        section: {
          id: "section1",
          name: "Section 1",
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
      },
      secondFormProgress: {
        section: {
          id: "section2",
          name: "Section 2",
          numSteps: 3,
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
        step: 1,
      },
    },
    {
      name: "the first section has steps and the second section has no steps",
      firstFormProgress: {
        section: {
          id: "section1",
          name: "Section 1",
          numSteps: 3,
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
        step: 3,
      },
      secondFormProgress: {
        section: {
          id: "section2",
          name: "Section 2",
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
      },
    },
    {
      name: "both the first and second section have steps",
      firstFormProgress: {
        section: {
          id: "section1",
          name: "Section 1",
          numSteps: 3,
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
        step: 3,
      },
      secondFormProgress: {
        section: {
          id: "section2",
          name: "Section 2",
          numSteps: 3,
          shouldShowProgressBar: true,
          shouldShowProgressHeadingAndRequiredMessage: true,
        },
        step: 1,
      },
    },
  ])(
    "gets the correct next and previous form progress when transitioning between sections and $name",
    ({ firstFormProgress, secondFormProgress }) => {
      const allSections = [firstFormProgress.section, secondFormProgress.section];
      expect(getNextFormProgress(firstFormProgress, allSections)).toEqual(secondFormProgress);
      expect(getPreviousFormProgress(secondFormProgress, allSections)).toEqual(firstFormProgress);
    },
  );
});

describe("isFinalFormProgress", () => {
  const otherSection = {
    id: "otherSection",
    name: "Other section",
    shouldShowProgressBar: true,
    shouldShowProgressHeadingAndRequiredMessage: true,
  };

  it("returns true when the form progress is final and has steps", () => {
    const sectionWithSteps = {
      id: "sectionWithSteps",
      name: "Section with steps",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
      numSteps: 2,
    };
    const allSections = [otherSection, sectionWithSteps];
    const currentFormProgress = {
      section: sectionWithSteps,
      step: 2,
    };
    expect(isFinalFormProgress(currentFormProgress, allSections)).toEqual(true);
  });

  it("returns true when the form progress is final and has no steps", () => {
    const sectionWithoutSteps = {
      id: "sectionWithoutSteps",
      name: "Section without steps",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    };

    const allSections = [otherSection, sectionWithoutSteps];
    const currentFormProgress = {
      section: sectionWithoutSteps,
    };
    expect(isFinalFormProgress(currentFormProgress, allSections)).toEqual(true);
  });

  it("returns false when the form progress is not final and has steps", () => {
    const sectionWithSteps = {
      id: "sectionWithSteps",
      name: "Section with steps",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
      numSteps: 2,
    };
    const allSections = [sectionWithSteps, otherSection];
    const currentFormProgress = {
      section: sectionWithSteps,
      step: 2,
    };
    expect(isFinalFormProgress(currentFormProgress, allSections)).toEqual(false);
  });

  it("returns false when the form progress is not final and has no steps", () => {
    const sectionWithoutSteps = {
      id: "sectionWithoutSteps",
      name: "Section without steps",
      shouldShowProgressBar: true,
      shouldShowProgressHeadingAndRequiredMessage: true,
    };

    const allSections = [sectionWithoutSteps, otherSection];
    const currentFormProgress = {
      section: sectionWithoutSteps,
    };
    expect(isFinalFormProgress(currentFormProgress, allSections)).toEqual(false);
  });
});
