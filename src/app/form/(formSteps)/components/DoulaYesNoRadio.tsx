import type {
  DoulaRadioOption,
  DoulaRadioProps,
} from "@/app/form/(formSteps)/components/DoulaRadio";
import DoulaRadio from "@/app/form/(formSteps)/components/DoulaRadio";
import type { FieldValues } from "react-hook-form";

interface DoulaYesNoRadioProps<T extends FieldValues> extends Omit<DoulaRadioProps<T>, "options"> {
  invalidOption?: { label: "Yes" | "No"; message: React.ReactNode };
}

const DoulaYesNoRadio = <T extends FieldValues>(props: DoulaYesNoRadioProps<T>) => {
  const { invalidOption, ...otherProps } = props;
  const optionYes: DoulaRadioOption<T> = {
    label: "Yes",
    value: "true",
  };
  const optionNo: DoulaRadioOption<T> = {
    label: "No",
    value: "false",
  };

  let jsxErrorMessage;
  let options = [optionYes, optionNo];
  if (invalidOption !== undefined) {
    const validValue = invalidOption.label === "Yes" ? "false" : "true";
    options = options.map((option) => {
      return {
        ...option,
        additionalRegisterOptions: {
          validate: (value: string) => value === validValue,
        },
      };
    });
    jsxErrorMessage = [
      {
        type: "validate",
        message: invalidOption.message,
      },
    ];
  }

  return <DoulaRadio options={options} jsxErrorMessage={jsxErrorMessage} {...otherProps} />;
};

export default DoulaYesNoRadio;
