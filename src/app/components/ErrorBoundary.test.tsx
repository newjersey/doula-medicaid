import ErrorBoundary from "@/app/components/ErrorBoundary";
import { render, screen } from "@testing-library/react";

describe("<ErrorBoundary />", () => {
  it("Displays and error message with contact information when a child component throws an error", () => {
    const ComponentWithError = () => {
      throw new Error("test");
    };

    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>,
    );

    screen.getByRole("heading", { name: "Sorry, something went wrong" });
  });

  it("Does not display the error message when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>This should still be present</div>
      </ErrorBoundary>,
    );

    screen.getByText("This should still be present");
    expect(
      screen.queryByRole("heading", { name: "Sorry, something went wrong" }),
    ).not.toBeInTheDocument();
  });
});
