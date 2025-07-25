import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../_utils/testUtils";
import FormProgressButtons from "./FormProgressButtons";

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
  it("shows only the next button when on the first step", async () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/1"
        router={router as AppRouterInstance}
      >
        <FormProgressButtons />
      </RouterPathnameProvider>,
    );

    const formProgressButtonGroup = getFormProgressButtonsList();
    expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(1);

    expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toHaveAttribute("type", "submit");
  });

  it("shows both previous and next buttons when on a middle step", async () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/2"
        router={router as AppRouterInstance}
      >
        <FormProgressButtons />
      </RouterPathnameProvider>,
    );

    const formProgressButtonGroup = getFormProgressButtonsList();
    expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(2);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/form/personal-details/1",
    );
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toHaveAttribute("type", "submit");
  });

  it("shows only the previous button when on the last step", () => {
    render(
      <RouterPathnameProvider pathname="/form/download">
        <FormProgressButtons />
      </RouterPathnameProvider>,
    );

    const formProgressButtonGroup = getFormProgressButtonsList();
    expect(within(formProgressButtonGroup).getAllByRole("listitem").length).toEqual(1);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/form/section-5",
    );
  });
});
