"use client";

import { Fieldset, Form, Radio } from "@trussworks/react-uswds";
import React from "react";
import { removeKey, setKeyValue } from "../../_utils/sessionStorage";

const DisclosuresStep: React.FC = () => {
  return (
    <div>
      <Form
        onSubmit={() => {
          throw "Not implemented";
        }}
      >
        <Fieldset legend="Is your doula business a sole proprietorship?" legendStyle="large">
          <Radio
            id="soleProprietorshipYes"
            name="setSoleProprietorship"
            label="Yes, my doula business is a sole proprietorship"
            onChange={() => setKeyValue("natureOfDisclosingEntity", "SoleProprietorship")}
          />
          <Radio
            id="soleProprietorshipNo"
            name="setSoleProprietorship"
            label="No, my doula business is not a sole proprietorship"
            onChange={() => removeKey("natureOfDisclosingEntity")}
          />
        </Fieldset>
      </Form>
    </div>
  );
};

export default DisclosuresStep;
