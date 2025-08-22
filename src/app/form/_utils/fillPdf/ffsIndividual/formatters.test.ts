import { formatNaIfBlank } from "@/app/form/_utils/fillPdf/formatters";

describe("formatNaIfBlank", () => {
  it("returns the value if the value is not blank", () => {
    expect(formatNaIfBlank("test")).toEqual("test");
  });

  it("returns N/A if the value is null", () => {
    expect(formatNaIfBlank(null)).toEqual("N/A");
  });

  it("returns N/A if the value is an empty string", () => {
    expect(formatNaIfBlank("")).toEqual("N/A");
  });

  it("returns N/A if the value is a string with only whitespace", () => {
    expect(formatNaIfBlank("     ")).toEqual("N/A");
  });
});
