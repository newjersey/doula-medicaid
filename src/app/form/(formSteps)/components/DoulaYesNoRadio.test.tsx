import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { render, screen, within } from "@testing-library/react";

describe("DoulaYesNoRadio", () => {
  it("renders a radio group with options Yes and No", () => {
    render(<DoulaYesNoRadio name="testRadio" value="" label="Yes or no?" register={jest.fn()} />);
    const group = screen.getByRole("group", { name: "Yes or no? Select one" });
    for (const optionLabel of ["Yes", "No"]) {
      expect(within(group).getByRole("radio", { name: optionLabel })).toBeInTheDocument();
    }
  });

  it.each([
    { invalidLabel: "Yes" as const, trueIsValid: false, falseIsValid: true },
    { invalidLabel: "No" as const, trueIsValid: true, falseIsValid: false },
  ])(
    "considers $invalidLabel invalid and shows the error message if not when errorOn is set to $invalidLabel",
    ({ invalidLabel, trueIsValid, falseIsValid }) => {
      const mockRegister = jest.fn();
      render(
        <DoulaYesNoRadio
          name="testRadio"
          value=""
          label="Yes or no?"
          invalidOption={{ label: invalidLabel, message: "This option is invalid" }}
          errors={{
            testRadio: { type: "validate" },
          }}
          register={mockRegister}
        />,
      );

      // The validate function is defined within the component and so difficult to test equality. We instead test that it does what it should.
      for (let i = 0; i < 2; i++) {
        const [arg1, arg2] = mockRegister.mock.calls[i];
        expect(arg1).toEqual("testRadio");
        expect(arg2.validate("true")).toEqual(trueIsValid);
        expect(arg2.validate("false")).toEqual(falseIsValid);
      }

      for (const optionLabel of ["Yes", "No"]) {
        const radio = screen.getByRole("radio", { name: optionLabel });
        expect(radio).toHaveAccessibleDescription("This option is invalid");
      }
    },
  );
});
