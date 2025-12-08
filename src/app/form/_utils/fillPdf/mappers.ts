import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";

type NoInfer<T> = [T][T extends unknown ? 0 : never];

interface YesNoPdfFields<T> {
  yesPdfKey: keyof NoInfer<T>;
  noPdfKey: keyof NoInfer<T>;
}
interface YesNoExplainYesPdfFields<T> extends YesNoPdfFields<T> {
  yesExplanationPdfKey: keyof NoInfer<T>;
}

export const mapYesNoFields = <
  T = "Must specify PdfField type T, e.g. mapYesNoFields<PdfFfsIndividualPage23>()",
>(
  isYes: boolean,
  pdfFields: YesNoPdfFields<T>,
) => {
  if (isYes === true) {
    return { [pdfFields.yesPdfKey]: true };
  }
  return { [pdfFields.noPdfKey]: true };
};

export const mapYesNoExplainYesFields = <
  T = "Must specify PdfField type T, e.g. mapYesNoExplainYesFields<PdfFfsIndividualPage23>()",
>(
  isYes: boolean,
  yesExplanation: string | null,
  pdfFields: YesNoExplainYesPdfFields<T>,
) => {
  if (isYes === true) {
    if (yesExplanation === null) {
      throw new UnexpectedFormDataError(
        `${pdfFields.yesPdfKey.toString()} is checked, but missing explanation for ${pdfFields.yesExplanationPdfKey.toString()} field.`,
      );
    }
    return {
      [pdfFields.yesPdfKey]: true,
      [pdfFields.yesExplanationPdfKey]: yesExplanation,
    };
  }
  return {
    [pdfFields.noPdfKey]: true,
  };
};
