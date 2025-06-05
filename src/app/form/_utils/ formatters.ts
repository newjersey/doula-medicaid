export const formatDateOfBirth = (dateOfBirth: Date | null): string => {
  return dateOfBirth
    ? `${dateOfBirth.getMonth()}/${dateOfBirth.getDate()}/${dateOfBirth.getFullYear()}`
    : "";
};
