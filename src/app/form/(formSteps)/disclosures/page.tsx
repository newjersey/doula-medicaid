"use client";

import { Fieldset, Form, Label, Radio, Select, TextInput } from "@trussworks/react-uswds";
import React, { useState } from "react";
import { AddressState } from "../../_utils/inputFields/enums";
import { removeKey, setKeyValue } from "../../_utils/sessionStorage";

interface DisclosureData {
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
}

const DisclosuresStep: React.FC = () => {
  const [isSoleProprietorship, setIsSoleProprietorship] = useState<boolean | null>(null);

  const [hasSeparateBusinessAddress, setHasSeparateBusinessAddress] = useState<boolean | null>(
    null,
  );

  const [businessAddress, setBusinessAddress] = useState<DisclosureData>({
    businessStreetAddress1: null,
    businessStreetAddress2: null,
    businessCity: null,
    businessState: null,
    businessZip: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessAddress((prev) => ({ ...prev, [name]: value }));
    setKeyValue(name, value);
  };

  return (
    <div>
      <Form
        onSubmit={() => {
          throw new Error("Not implemented");
        }}
      >
        <Fieldset legend="Is your doula business a sole proprietorship?" legendStyle="large">
          <Radio
            id="soleProprietorshipYes"
            name="setSoleProprietorship"
            label="Yes, my doula business is a sole proprietorship"
            onChange={() => {
              setKeyValue("natureOfDisclosingEntity", "SoleProprietorship");
              setIsSoleProprietorship(true);
            }}
            checked={isSoleProprietorship === true}
          />
          <Radio
            id="soleProprietorshipNo"
            name="setSoleProprietorship"
            label="No, my doula business is not a sole proprietorship"
            onChange={() => {
              removeKey("natureOfDisclosingEntity");
              setIsSoleProprietorship(false);
            }}
            checked={isSoleProprietorship === false}
          />
        </Fieldset>

        {isSoleProprietorship === true && (
          <Fieldset
            legend="Do you have a separate business address that's different from your mailing address?"
            legendStyle="large"
          >
            <Radio
              id="separateBusinessAddressYes"
              name="setSeparateBusinessAddress"
              label="Yes, I have a separate business address"
              onChange={() => {
                setKeyValue("separateBusinessAddress", "true");
                setHasSeparateBusinessAddress(true);
              }}
              checked={hasSeparateBusinessAddress === true}
            />
            <Radio
              id="separateBusinessAddressNo"
              name="setSeparateBusinessAddress"
              label="No, I do not have a separate business address"
              onChange={() => {
                setKeyValue("separateBusinessAddress", "false");
                setHasSeparateBusinessAddress(false);
              }}
              checked={hasSeparateBusinessAddress === false}
            />
          </Fieldset>
        )}

        {hasSeparateBusinessAddress === true && (
          <Fieldset legend="Business address" legendStyle="srOnly">
            <Label htmlFor="businessStreetAddress1">Street address 1</Label>
            <TextInput
              id="businessStreetAddress1"
              name="businessStreetAddress1"
              type="text"
              inputMode="numeric"
              required
              value={businessAddress.businessStreetAddress1 || ""}
              onChange={handleChange}
            />

            <Label htmlFor="businessStreetAddress2" hint=" (optional)">
              Street address 2
            </Label>
            <TextInput
              id="businessStreetAddress2"
              name="businessStreetAddress2"
              type="text"
              value={businessAddress.businessStreetAddress2 || ""}
              onChange={handleChange}
            />

            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-8">
                <Label htmlFor="businessCity">City</Label>
                <TextInput
                  className="usa-input"
                  id="businessCity"
                  name="businessCity"
                  type="text"
                  required
                  value={businessAddress.businessCity || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mobile-lg:grid-col-4">
                <Label htmlFor="businessState">State</Label>
                <Select
                  className="usa-select"
                  id="businessState"
                  name="businessState"
                  required
                  value={businessAddress.businessState || ""}
                  onChange={handleChange}
                >
                  {Object.keys(AddressState).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <Label htmlFor="businessZip">ZIP code</Label>
            <TextInput
              className="usa-input usa-input--medium"
              id="businessZip"
              name="businessZip"
              type="text"
              pattern="[\d]{5}(-[\d]{4})?"
              required
              value={businessAddress.businessZip || ""}
              onChange={handleChange}
            />
          </Fieldset>
        )}
      </Form>
    </div>
  );
};

export default DisclosuresStep;
