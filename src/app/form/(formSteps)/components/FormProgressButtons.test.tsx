import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import * as nextThirdPartiesGoogle from "@next/third-parties/google";
import { within } from "@testing-library/dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const getFormProgressButtonsList = () => {
  const allLists = screen.getAllByRole("list");
  const formProgressButtonsList = allLists.find((list) => {
    let foundNextOrPrevious = false;
    const previousButton = within(list).queryByRole("link", { name: "Previous" });
    const nextButton = within(list).queryByRole("button", { name: "Next" });
    if (previousButton !== null || nextButton !== null) {
      foundNextOrPrevious = true;
    }
    return foundNextOrPrevious;
  });
  expect(formProgressButtonsList).toBeDefined();
  return formProgressButtonsList as HTMLElement;
};

describe("<FormProgressButtons />", () => {
  describe("shows appropriate buttons depending on the page", () => {
    it("shows only the next button when on the first step", async () => {
      renderWithProviders(<FormProgressButtons />, "/form/welcome");

      const formProgressButtonGroup = getFormProgressButtonsList();
      expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(1);

      expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton).toHaveAttribute("type", "submit");
    });

    it("shows both previous and next buttons when on a middle step", async () => {
      renderWithProviders(<FormProgressButtons />, "/form/personal/2");

      const formProgressButtonGroup = getFormProgressButtonsList();
      expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(2);

      expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
        "href",
        "/form/personal/1",
      );
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton).toHaveAttribute("type", "submit");
    });

    it("shows only the previous button when on the last step", () => {
      renderWithProviders(<FormProgressButtons />, "/form/review");

      const formProgressButtonGroup = getFormProgressButtonsList();
      expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(1);

      expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
        "href",
        "/form/business/4",
      );
    });
  });

  describe("sends GA events", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("when Next is clicked", async () => {
      const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
      renderWithProviders(<FormProgressButtons />, "/form/personal/2");
      await screen.getByRole("button", { name: "Next" }).click();
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "progressNext");
    });
    it("when Previous is clicked", async () => {
      const user = userEvent.setup();
      const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
      renderWithProviders(<FormProgressButtons />, "/form/personal/2");
      await user.click(screen.getByRole("link", { name: "Previous" }));
      expect(mockSendGAEvent).toHaveBeenCalledWith("event", "progressPrevious");
    });
  });
});
