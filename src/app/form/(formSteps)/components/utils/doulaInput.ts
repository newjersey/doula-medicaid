import type { FieldErrors, FieldPath, FieldValues } from "react-hook-form";

export const formatErrorMessageId = (name: string) => {
  return `${name}ErrorMessage`;
};

export const formatHintId = (name: string) => {
  return `${name}Hint`;
};

export const formatDescribedBy = <T extends FieldValues>(
  name: FieldPath<T>,
  errors: FieldErrors<T> | undefined,
  hint: React.ReactNode | undefined,
  additionalDescriptionIds: string | undefined,
) => {
  const describedbys = [];
  if (errors !== undefined && errors[name]) {
    describedbys.push(formatErrorMessageId(name));
  }
  if (hint !== undefined) {
    describedbys.push(formatHintId(name));
  }
  if (additionalDescriptionIds !== undefined) {
    describedbys.push(additionalDescriptionIds);
  }
  return describedbys.join(" ");
};

export const formatInputErrorLabel = (label: string, errorLabelPrefix: string | undefined) => {
  if (errorLabelPrefix !== undefined) {
    return `${errorLabelPrefix} ${label.toLowerCase()}`;
  }
  return label;
};
