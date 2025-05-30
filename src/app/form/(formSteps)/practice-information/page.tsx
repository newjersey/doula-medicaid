"use client";

import React, { useContext } from "react";
import { FormContext } from "../../FormContext";

const FormStep: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formData, setFormData } = useContext(FormContext);

  return <div>{JSON.stringify(formData)}</div>;
};

export default FormStep;
