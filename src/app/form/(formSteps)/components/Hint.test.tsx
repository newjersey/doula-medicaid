import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { render, screen } from "@testing-library/react";

describe("Hint", () => {
  it("renders the provided string hint", () => {
    render(<Hint name="testId" hint="Test hint" />);
    expect(screen.getByText("Test hint")).toHaveAttribute("id", "testIdHint");
  });
});
