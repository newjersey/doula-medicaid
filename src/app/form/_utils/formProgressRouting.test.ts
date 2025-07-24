import { formatFormProgressUrl } from "./formProgressRouting";

describe("formatFormProgressUrl", () => {
  it("formats the URL correctly when the section has no steps", () => {
    const formProgress = {
      section: { id: "section1", progressBarTitle: "Section 1", heading: "Section 1" },
    };
    expect(formatFormProgressUrl(formProgress)).toEqual("/form/section1");
  });
  it("formats the URL correctly when the section has steps", () => {
    const formProgress = {
      section: { id: "section1", progressBarTitle: "Section 1", heading: "Section 1", numSteps: 3 },
      step: 2,
    };
    expect(formatFormProgressUrl(formProgress)).toEqual("/form/section1/2");
  });
});
