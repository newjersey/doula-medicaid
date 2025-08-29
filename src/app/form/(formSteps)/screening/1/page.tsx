"use client";

import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import SoleProprietorExplainer from "@/app/form/(formSteps)/screening/1/SoleProprietorExplainer";
import type { Screening1Data } from "@/app/form/(formSteps)/screening/ScreeningData";
import { createFormSubmitHandler } from "@/app/form/_utils/formHandlers";
import { getDefaultBoolean } from "@/app/form/_utils/sessionStorage";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ScreeningStep1 = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Screening1Data>({
    defaultValues: { isSoleProprietor: getDefaultBoolean("isSoleProprietor") },
  });
  const isSoleProprietor = watch("isSoleProprietor");

  const onSubmit = createFormSubmitHandler<Screening1Data>(router, formProgressPosition);

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
          <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
            <div className="desktop:grid-col-8">
              <h2 className="font-heading-md">This beta site is currently for Sole Proprietors</h2>
              <p className="usa-hint">
                If you have an LLC or another business type, use the standard Medicaid
                Fee-for-Service application.
              </p>
              <DoulaYesNoRadio
                name="isSoleProprietor"
                value={isSoleProprietor}
                label={
                  <div>
                    <p>
                      Do you manage your business as an individual doula operating as a Sole
                      Proprietor?
                    </p>
                    <p className="usa-hint">
                      Most NJ FamilyCare doulas operate as Sole Proprietor.
                    </p>
                  </div>
                }
                required
                invalidOption={{
                  label: "No",
                  message: (
                    <span>
                      Currently this site is only for Sole Proprietors. Please use the{" "}
                      <a
                        href="https://www.njmmis.com/providerEnrollment.aspx "
                        target="_blank"
                        rel="noopener"
                      >
                        standard FFS application
                      </a>
                      .
                    </span>
                  ),
                }}
                register={register}
                errors={errors}
              />
            </div>
            <div className="form-explainer desktop:grid-col-4">
              <SoleProprietorExplainer />
            </div>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default ScreeningStep1;
