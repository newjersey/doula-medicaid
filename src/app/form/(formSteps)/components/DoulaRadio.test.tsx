import DoulaRadio from "@/app/form/(formSteps)/components/DoulaRadio";
import { render, screen, within } from "@testing-library/react";

const threeOptions = [
  {
    label: "Option 1",
    value: "option1",
  },
  {
    label: "Option 2",
    value: "option2",
  },
  {
    label: "Option 3",
    value: "option3",
  },
];

describe("DoulaRadio", () => {
  it("renders a group with all the radio options", () => {
    const mockRegister = jest.fn();
    render(
      <DoulaRadio
        name="testRadio"
        value=""
        label="What option do you choose?"
        options={threeOptions}
        register={mockRegister}
      />,
    );
    expect(mockRegister).toHaveBeenCalledTimes(threeOptions.length);
    expect(mockRegister).toHaveBeenCalledWith("testRadio", {});

    const group = screen.getByRole("group", { name: "What option do you choose? Select one" });
    expect(group).toBeInTheDocument();
    for (const option of threeOptions) {
      const radio = within(group).getByRole("radio", { name: option.label });
      expect(radio).toBeInTheDocument();
      expect(radio).not.toBeChecked();
      expect(radio).not.toHaveAttribute("required");
      expect(radio).not.toHaveAttribute("aria-invalid");
      expect(radio).not.toHaveAttribute("aria-describedby");
    }
  });

  it("check the appropriate radio option if one is selected", () => {
    render(
      <DoulaRadio
        name="testRadio"
        value="option2"
        label="What option do you choose?"
        options={threeOptions}
        register={jest.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "Option 2" })).toBeChecked();
    for (const optionLabel of ["Option 1", "Option 3"]) {
      expect(screen.getByRole("radio", { name: optionLabel })).not.toBeChecked();
    }
  });

  it("calls registered with required and sets appropriate attributes when the input is required", () => {
    const mockRegister = jest.fn();
    const expectedRegisterOptions = {
      required: "This question is required",
    };
    render(
      <DoulaRadio
        name="testRadio"
        value=""
        label="What option do you choose?"
        required
        options={threeOptions}
        errors={{}}
        register={mockRegister}
      />,
    );
    expect(mockRegister).toHaveBeenCalledTimes(threeOptions.length);
    expect(mockRegister).toHaveBeenCalledWith("testRadio", expectedRegisterOptions);

    for (const option of threeOptions) {
      const radio = screen.getByRole("radio", { name: option.label });
      expect(radio).toHaveAttribute("required");
    }
  });

  it("accepts additional register options", () => {
    const mockRegister = jest.fn();
    const validationFunction = (value: string) => value === "true";
    render(
      <DoulaRadio
        name="testRadio"
        value={""}
        label="What option do you choose?"
        required
        options={[
          {
            label: "Yes",
            value: "true",
          },
          {
            label: "No",
            value: "false",
            additionalRegisterOptions: { validate: validationFunction },
          },
        ]}
        errors={{}}
        register={mockRegister}
      />,
    );
    expect(mockRegister).toHaveBeenNthCalledWith(1, "testRadio", {
      required: "This question is required",
    });
    expect(mockRegister).toHaveBeenNthCalledWith(2, "testRadio", {
      required: "This question is required",
      validate: validationFunction,
    });
  });

  it("shows an error message and sets appropriate attributes when there is an error for the radio group", () => {
    render(
      <DoulaRadio
        name="testRadio"
        value={""}
        label="What option do you choose?"
        required
        options={threeOptions}
        errors={{
          testRadio: {
            type: "required",
            message: "This question is required",
          },
        }}
        register={jest.fn()}
      />,
    );

    for (const option of threeOptions) {
      const radio = screen.getByRole("radio", { name: option.label });
      expect(radio).toHaveAccessibleDescription("This question is required");
      expect(radio).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("shows a custom error message if provided", async () => {
    render(
      <DoulaRadio<{ testRadio: string; otherInput: string }>
        name="testRadio"
        value={""}
        label="What option do you choose?"
        required
        options={threeOptions}
        errors={{
          testRadio: {
            type: "required",
          },
        }}
        customErrorMessages={[
          {
            type: "required",
            message: (
              <div>
                Fancy error <span>message</span>
              </div>
            ),
          },
        ]}
        register={jest.fn()}
      />,
    );

    for (const option of threeOptions) {
      const radio = screen.getByRole("radio", { name: option.label });
      expect(radio).toHaveAccessibleDescription("Fancy error message");
      expect(radio).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("does not show an error message if there is no error for the input", () => {
    render(
      <DoulaRadio<{ testRadio: string; otherInput: string }>
        name="testRadio"
        value={""}
        label="What option do you choose?"
        required
        options={threeOptions}
        errors={{
          otherInput: {
            type: "required",
            message: "This other question is required",
          },
        }}
        register={jest.fn()}
      />,
    );

    for (const option of threeOptions) {
      const radio = screen.getByRole("radio", { name: option.label });
      expect(radio).not.toHaveAttribute("aria-invalid");
      expect(radio).not.toHaveAttribute("aria-describedby");
    }
  });

  it("throws an error if any provided option has whitespace in the value", () => {
    expect(() =>
      render(
        <DoulaRadio<{ testRadio: string; otherInput: string }>
          name="testRadio"
          value={""}
          label="What option do you choose?"
          required
          options={[
            {
              label: "Yes",
              value: "true",
            },
            {
              label: "No",
              value: "test value",
            },
          ]}
          register={jest.fn()}
        />,
      ),
    ).toThrow(
      "The option value is used in the HTML id, and should not have white space: test value",
    );
  });
});
