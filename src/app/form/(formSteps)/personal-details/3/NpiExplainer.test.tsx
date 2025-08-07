import NpiExplainer from "@/app/form/(formSteps)/personal-details/3/NpiExplainer";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<NpiExplainer />", () => {
  it("allows simultaneously expanding all questions", async () => {
    const user = userEvent.setup();
    render(<NpiExplainer />);
    const explainerQuestions = [
      "What is an NPI?",
      "Where can I get my NPI?",
      "What is the doula taxonomy code?",
      "How can I add the taxonomy code?",
      "Is the information in my NPI public?",
    ];
    for (const explainerQuestion of explainerQuestions) {
      await user.click(screen.getByRole("button", { name: explainerQuestion }));
    }
    for (const explainerQuestion of explainerQuestions) {
      expect(
        screen.getByRole("button", { name: explainerQuestion, expanded: true }),
      ).toBeInTheDocument();
    }
  });
});
