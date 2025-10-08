import { formatFormProgressUrl } from "@form/_utils/formProgressRouting";

describe("formatFormProgressUrl", () => {
  it("formats the URL correctly when the section has no steps", () => {
    const formProgress = {
      section: {
        id: "section1",
        name: "Section 1",
        shouldShowProgressBar: true,
        shouldShowProgressHeadingAndRequiredMessage: true,
      },
    };
    expect(formatFormProgressUrl(formProgress)).toEqual("/form/section1");
  });
  it("formats the URL correctly when the section has steps", () => {
    const formProgress = {
      section: {
        id: "section1",
        name: "Section 1",
        numSteps: 3,
        shouldShowProgressBar: true,
        shouldShowProgressHeadingAndRequiredMessage: true,
      },
      step: 2,
    };
    expect(formatFormProgressUrl(formProgress)).toEqual("/form/section1/2");
  });
});
