import { createContext } from "react";

export type FormData = {
  firstName: string | null;
  lastName: string | null;
};

export const initialFormData = {
  firstName: null,
  lastName: null,
};

export const FormContext = createContext<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}>({
  formData: initialFormData,
  setFormData: () => {
    throw "Unexpected call to context default setFormData";
  },
});
