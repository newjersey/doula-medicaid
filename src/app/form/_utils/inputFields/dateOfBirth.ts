export const formatDateOfBirthDefaultValue = (dateOfBirth: Date) => {
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(dateOfBirth);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(dateOfBirth);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(dateOfBirth);
  const format = `${year}-${month}-${day}`;
  return format;
};
