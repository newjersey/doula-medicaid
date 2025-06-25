export const formatDateOfBirth = (dateOfBirth: Date | null): string => {
  return dateOfBirth
    ? dateOfBirth.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";
};
