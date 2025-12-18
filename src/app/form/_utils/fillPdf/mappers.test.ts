import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapYesNoExplainYesFields, mapYesNoFields } from "@/app/form/_utils/fillPdf/mappers";

interface TestPdfFields {
  hasDoneThisYes: boolean;
  hasDoneThisNo: boolean;
  explainWhyYes: string;
}

describe("mapYesNoFields", () => {
  it("maps to yesPdfKey when isYes is true", () => {
    expect(
      mapYesNoFields<TestPdfFields>(true, {
        yesPdfKey: "hasDoneThisYes",
        noPdfKey: "hasDoneThisNo",
      }),
    ).toEqual({
      hasDoneThisYes: true,
    });
  });
  it("maps to noPdfKey when isYes is false", () => {
    expect(
      mapYesNoFields<TestPdfFields>(false, {
        yesPdfKey: "hasDoneThisYes",
        noPdfKey: "hasDoneThisNo",
      }),
    ).toEqual({
      hasDoneThisNo: true,
    });
  });
});

describe("mapYesNoExplainYesFields", () => {
  it("throws an UnexpectedFormDataError when isYes is true but yesExplanation is not provided", () => {
    const testFunction = () =>
      mapYesNoExplainYesFields<TestPdfFields>(true, null, {
        yesPdfKey: "hasDoneThisYes",
        noPdfKey: "hasDoneThisNo",
        yesExplanationPdfKey: "explainWhyYes",
      });
    expect(testFunction).toThrow(UnexpectedFormDataError);
    expect(testFunction).toThrow(
      "hasDoneThisYes is checked, but missing explanation for explainWhyYes field.",
    );
  });

  it("maps to yes and yesExplanation pdf keys when isYes is true", () => {
    const mappedFields = mapYesNoExplainYesFields<TestPdfFields>(true, "Test explanation", {
      yesPdfKey: "hasDoneThisYes",
      noPdfKey: "hasDoneThisNo",
      yesExplanationPdfKey: "explainWhyYes",
    });
    expect(mappedFields).toEqual({
      hasDoneThisYes: true,
      explainWhyYes: "Test explanation",
    });
  });

  it("maps to noPdfKey when isYes is false", () => {
    const mappedFields = mapYesNoExplainYesFields<TestPdfFields>(false, null, {
      yesPdfKey: "hasDoneThisYes",
      noPdfKey: "hasDoneThisNo",
      yesExplanationPdfKey: "explainWhyYes",
    });
    expect(mappedFields).toEqual({
      hasDoneThisNo: true,
    });
  });
});
