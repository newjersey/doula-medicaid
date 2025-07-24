"use client";

import { Fieldset, Form, Radio } from "@trussworks/react-uswds";
import React, { useState } from "react";
import { setKeyValue } from "../../_utils/sessionStorage";

const DisclosuresStep: React.FC = () => {
  const [hadLunch, setHadLunch] = useState<boolean | null>(null);
  const [lunchWasTasty, setLunchWasTasty] = useState<boolean | null>(null);
  return (
    <div>
      <Form
        onSubmit={() => {
          throw new Error("Not implemented");
        }}
      >
        <Fieldset legend="Have you had lunch today?" legendStyle="default">
          <Radio
            id="hadLunchYes"
            name="hadLunch"
            label="Yes"
            onChange={() => {
              setKeyValue("hadLunch", "true");
              setHadLunch(true);
            }}
          />
          <Radio
            id="hadLunchNo"
            name="hadLunch"
            label="No"
            onChange={() => {
              setKeyValue("hadLunch", "false");
              setHadLunch(false);
            }}
          />
        </Fieldset>
        {hadLunch === true && (
          <div className="padding-y-4">
            <Fieldset legend="Was your lunch tasty?" legendStyle="default">
              <Radio
                id="lunchYes"
                name="lunchWasTasty"
                label="Yes"
                onChange={() => {
                  setKeyValue("lunchWasTasty", "true");
                  setLunchWasTasty(true);
                }}
              />
              <Radio
                id="lunchNo"
                name="lunchWasTasty"
                label="No"
                onChange={() => {
                  setKeyValue("lunchWasTasty", "false");
                  setLunchWasTasty(false);
                }}
              />
            </Fieldset>
            {lunchWasTasty !== null && (
              <div className="padding-y-4">{lunchWasTasty ? "Yay!" : "Boo"}</div>
            )}
          </div>
        )}
      </Form>
    </div>
  );
};

export default DisclosuresStep;
