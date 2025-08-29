import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import { render, screen } from "@testing-library/react";
import { type FieldErrors } from "react-hook-form";

describe("ErrorMessage", () => {
  it("does not render an error message if there is no error", () => {
    const element = render(<ErrorMessage name="testErrorMessage" errors={{}} />);
    expect(element.container.textContent).toEqual("");
  });

  it("renders a string error message", () => {
    const errors: FieldErrors<{ testErrorMessage: string }> = {
      testErrorMessage: {
        type: "required",
        message: "This field is required",
      },
    };
    render(<ErrorMessage name="testErrorMessage" errors={errors} />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders a custom error message if the type matches", () => {
    const errors: FieldErrors<{ testErrorMessage: string }> = {
      testErrorMessage: {
        type: "required",
      },
    };
    const customErrorMessages = [
      {
        type: "required",
        message: (
          <p>
            Fancy error <span>message</span>
          </p>
        ),
      },
    ];
    const element = render(
      <ErrorMessage
        name="testErrorMessage"
        errors={errors}
        customErrorMessages={customErrorMessages}
      />,
    );
    expect(element.container.textContent).toEqual("Fancy error message");
  });

  it("renders a custom error message if the type matches and a string error message is also provided", () => {
    const errors: FieldErrors<{ testErrorMessage: string }> = {
      testErrorMessage: {
        type: "required",
        message: "This will get overwritten",
      },
    };
    const customErrorMessages = [
      {
        type: "required",
        message: (
          <p>
            Fancy error <span>message</span>
          </p>
        ),
      },
    ];
    const element = render(
      <ErrorMessage
        name="testErrorMessage"
        errors={errors}
        customErrorMessages={customErrorMessages}
      />,
    );
    expect(element.container.textContent).toEqual("Fancy error message");
  });

  it("renders the regular string error message if custom errors are provided but the type does not match", () => {
    const errors: FieldErrors<{ testErrorMessage: string }> = {
      testErrorMessage: {
        type: "minLength",
        message: "Must have 10 digits",
      },
    };
    const customErrorMessages = [
      {
        type: "required",
        message: <p>This is required</p>,
      },
    ];
    render(
      <ErrorMessage
        name="testErrorMessage"
        errors={errors}
        customErrorMessages={customErrorMessages}
      />,
    );
    expect(screen.getByText("Must have 10 digits")).toBeInTheDocument();
  });

  it("throws in error if the error has no message", () => {
    const errors: FieldErrors<{ testErrorMessage: string }> = {
      testErrorMessage: {
        type: "minLength",
      },
    };
    const customErrorMessages = [
      {
        type: "required",
        message: <p>This is required</p>,
      },
    ];
    expect(() =>
      render(
        <ErrorMessage
          name="testErrorMessage"
          errors={errors}
          customErrorMessages={customErrorMessages}
        />,
      ),
    ).toThrow("Unexpected error with no message");
  });
});
