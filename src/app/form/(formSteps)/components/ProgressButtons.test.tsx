import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../_utils/testUtils";
import ProgressButtons, { formatStepUrl, getNextStep, getPreviousStep } from "./ProgressButtons";

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

describe("getNextStep", () => {
  it("returns null when the current section has no steps and is the last one", () => {
    const section = { id: "section1", sectionName: "Section 1", heading: "Section 1" };
    const allSections = [section];
    const currentStep = {
      section,
      stepNum: null,
    };
    expect(getNextStep(currentStep, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the last one", () => {
    const section = {
      id: "section1",
      sectionName: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const currentStep = {
      section,
      stepNum: 2,
    };
    expect(getNextStep(currentStep, allSections)).toEqual(null);
  });
});

describe("getPreviousStep", () => {
  it("returns null when the current section has no steps and is the first one", () => {
    const section = { id: "section1", sectionName: "Section 1", heading: "Section 1" };
    const allSections = [section];
    const currentStep = {
      section,
      stepNum: null,
    };
    expect(getPreviousStep(currentStep, allSections)).toEqual(null);
  });

  it("returns null when the current section has steps and is the first one", () => {
    const section = {
      id: "section1",
      sectionName: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const currentStep = {
      section,
      stepNum: 1,
    };
    expect(getPreviousStep(currentStep, allSections)).toEqual(null);
  });
});

describe("getNextStep and getPreviousStep", () => {
  it("gets the correct next and previous steps when transitioning within a section", () => {
    const section = {
      id: "section1",
      sectionName: "Section 1",
      heading: "Section 1",
      numSteps: 2,
    };
    const allSections = [section];
    const firstStep = {
      section,
      stepNum: 1,
    };
    const secondStep = {
      section,
      stepNum: 2,
    };

    expect(getNextStep(firstStep, allSections)).toEqual(secondStep);
    expect(getPreviousStep(secondStep, allSections)).toEqual(firstStep);
  });

  it.each([
    {
      name: "both the first and second sections have no steps",
      firstStep: {
        section: { id: "section1", sectionName: "Section 1", heading: "Section 1" },
        stepNum: null,
      },
      secondStep: {
        section: { id: "section2", sectionName: "Section 2", heading: "Section 2" },
        stepNum: null,
      },
    },
    {
      name: "the first section has no steps and the second section has steps",
      firstStep: {
        section: { id: "section1", sectionName: "Section 1", heading: "Section 1" },
        stepNum: null,
      },
      secondStep: {
        section: { id: "section2", sectionName: "Section 2", heading: "Section 2", numSteps: 3 },
        stepNum: 1,
      },
    },
    {
      name: "the first section has steps and the second section has no steps",
      firstStep: {
        section: { id: "section1", sectionName: "Section 1", heading: "Section 1", numSteps: 3 },
        stepNum: 3,
      },
      secondStep: {
        section: { id: "section2", sectionName: "Section 2", heading: "Section 2" },
        stepNum: null,
      },
    },
    {
      name: "both the first and second section have steps",
      firstStep: {
        section: { id: "section1", sectionName: "Section 1", heading: "Section 1", numSteps: 3 },
        stepNum: 3,
      },
      secondStep: {
        section: { id: "section2", sectionName: "Section 2", heading: "Section 2", numSteps: 3 },
        stepNum: 1,
      },
    },
  ])(
    "gets the correct next and previous steps when transitioning between sections and $name",
    ({ firstStep, secondStep }) => {
      const allSections = [firstStep.section, secondStep.section];
      expect(getNextStep(firstStep, allSections)).toEqual(secondStep);
      expect(getPreviousStep(secondStep, allSections)).toEqual(firstStep);
    },
  );
});

describe("formatStepUrl", () => {
  it("formats the URL correctly when the section has no steps", () => {
    const step = {
      section: { id: "section1", sectionName: "Section 1", heading: "Section 1" },
      stepNum: null,
    };
    expect(formatStepUrl(step)).toEqual("/form/section1");
  });
  it("formats the URL correctly when the section has steps", () => {
    const step = {
      section: { id: "section1", sectionName: "Section 1", heading: "Section 1", numSteps: 3 },
      stepNum: 2,
    };
    expect(formatStepUrl(step)).toEqual("/form/section1/2");
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
