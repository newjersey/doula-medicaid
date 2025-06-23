export const formatDateOfBirth = (dateOfBirth: Date | null): string => {
  return dateOfBirth ? dateOfBirth.toLocaleDateString("en-US") : "";
};
