import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../_utils/testUtils";
import ProgressButtons, {
  formatFormProgressUrl,
  getNextFormProgress,
  getPreviousFormProgress,
} from "./ProgressButtons";

const getProgressButtonsList = () => {
  const allLists = screen.getAllByRole("list");
  const progressButtonsList = allLists.find((list) => {
    let foundNextOrPrevious = false;
    const previousButton = within(list).queryByRole("link", { name: "Previous" });
    const nextButton = within(list).queryByRole("button", { name: "Next" });
    if (previousButton !== null || nextButton !== null) {
      foundNextOrPrevious = true;
    }
    return foundNextOrPrevious;
  });
  expect(progressButtonsList).toBeDefined();
  return progressButtonsList as HTMLElement;
};

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

describe("<ProgressButtons />", () => {
  it("shows only the next button when on the first step", async () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    const user = userEvent.setup();
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/1"
        router={router as AppRouterInstance}
      >
        <ProgressButtons />
      </RouterPathnameProvider>,
    );

    const progressButtonGroup = getProgressButtonsList();
    expect(within(progressButtonGroup).getAllByRole("listitem").length).toEqual(1);

    expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeInTheDocument();
    await user.click(nextButton);
    expect(mockPush).toHaveBeenCalledWith("/form/personal-details/2");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("shows both previous and next buttons when on a middle step", async () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    const user = userEvent.setup();
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/2"
        router={router as AppRouterInstance}
      >
        <ProgressButtons />
      </RouterPathnameProvider>,
    );

    const progressButtonGroup = getProgressButtonsList();
    expect(within(progressButtonGroup).getAllByRole("listitem").length).toEqual(2);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/form/personal-details/1",
    );
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeInTheDocument();
    await user.click(nextButton);
    expect(mockPush).toHaveBeenCalledWith("/form/personal-details/3");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("shows only the previous button when on the last step", () => {
    render(
      <RouterPathnameProvider pathname="/form/download">
        <ProgressButtons />
      </RouterPathnameProvider>,
    );

    const progressButtonGroup = getProgressButtonsList();
    expect(within(progressButtonGroup).getAllByRole("listitem").length).toEqual(1);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("href", "/form/step-5");
  });
});
