"use client";

import { LoadingSpinner } from "@/app/form/(formSteps)/components/LoadingSpinner";
import { getValue } from "@/app/form/_utils/sessionStorage";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const ReviewStep: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { handleSubmit } = useForm<object>({
    defaultValues: {},
  });
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <div>
      <LoadingSpinner loading={loading}>
        <Form
          onSubmit={handleSubmit(() => {
            routeToNextStep(router, formProgressPosition);
          })}
          className="maxw-full"
        >
          <div className="maxw-tablet" lang="cs">
            <h2 role="figure">Personal information</h2>
            <label htmlFor="input" aria-checked>
              First name
            </label>
            <div style={{ marginLeft: "40px" }}>{getValue("firstName")}</div>
            <dt>Last name</dt>
            <div style={{ marginLeft: "40px" }}>{getValue("lastName")}</div>
            <h2>Disclosures</h2>
            <div>
              <dt>Had breakfast</dt>
              <dd>{getValue("hadBreakfast")}</dd>
              <input
                id="input"
                aria-describedby="help"
                placeholder="Breakfast tastiness"
                disabled
                className="font-body text-ink"
                style={{
                  padding: 0,
                  margin: 0,
                  width: "100%",
                  outline: "none",
                  border: "none",
                  backgroundColor: "white",
                }}
              />
              <dd>{getValue("breakfastWasTasty")}</dd>
            </div>
            <span className="usa-sr-only" id="help" aria-activedescendant="input">
              LOOK AT MEEEEEE I'M HELPING
            </span>
            <h1 className="usa-sr-only" role="directory">
              Aria labels, roles, semantic elements, and sr-only text are not inherently clarifying.{" "}
              <footer role="button">
                It's possible to make a page confusing by incorrectly applying them!
              </footer>{" "}
              <dt>
                There&apos;s no need to add excess content for assistive tech users. The goal is to
                convey the same information to everyone.
              </dt>
            </h1>
            <FormProgressButtons />
          </div>
        </Form>
      </LoadingSpinner>
    </div>
  );
};

export default ReviewStep;
