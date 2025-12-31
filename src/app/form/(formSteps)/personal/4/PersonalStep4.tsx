"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaAddressState } from "@/app/form/(formSteps)/components/DoulaAddressState";
import { DoulaAddressZip } from "@/app/form/(formSteps)/components/DoulaAddressZip";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import BankAccountExplainer from "@/app/form/(formSteps)/personal/4/BankAccountExplainer";
import DirectDepositExplainer from "@/app/form/(formSteps)/personal/4/DirectDepositExplainer";
import type { Personal4Data } from "@/app/form/(formSteps)/personal/PersonalData";
import { getBoolean, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { Checkbox } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const manualFocusOrder: Array<keyof Personal4Data> = [
  "bankName",
  "bankCity",
  "bankState",
  "bankZip",
  "nameOnBankAccount",
  "hasJointBankAccount",
  "secondNameOnJointBankAccount",
  "bankRoutingNumber",
  "bankAccountNumber",
];

const showErrorSummary = true;
const PersonalStep4 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Personal4Data>({
    defaultValues: {
      bankName: getDefaultValue(dataStore, "bankName") ?? "",
      bankCity: getDefaultValue(dataStore, "bankCity") ?? "",
      bankState: getDefaultValue(dataStore, "bankState") ?? "",
      bankZip: getDefaultValue(dataStore, "bankZip") ?? "",
      nameOnBankAccount: getDefaultValue(dataStore, "nameOnBankAccount") ?? "",
      hasJointBankAccount: getBoolean(dataStore, "hasJointBankAccount", false) ?? false,
      secondNameOnJointBankAccount:
        getDefaultValue(dataStore, "secondNameOnJointBankAccount") ?? "",
      bankRoutingNumber: getDefaultValue(dataStore, "bankRoutingNumber") ?? "",
      bankAccountNumber: getDefaultValue(dataStore, "bankAccountNumber") ?? "",
    },
    shouldFocusError: !showErrorSummary,
  });

  const bankZip = watch("bankZip");
  const hasJointBankAccount = watch("hasJointBankAccount");

  return (
    <DoulaForm<Personal4Data>
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      manualFocusOrder={manualFocusOrder}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Direct deposit details</h2>
          <p>
            NJ FamilyCare requires providers to sign up for automated direct deposits. Please select
            the bank where you wish to receive your payments. This tool does not save any of your
            bank information.
          </p>

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-6">
              <DoulaTextInput
                name="bankName"
                label="Bank name"
                required
                errors={errors}
                register={register}
              />
              <DoulaTextInput
                name="bankCity"
                label="City"
                required
                errors={errors}
                register={register}
              />
            </div>
          </div>

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-6">
              <DoulaAddressState
                name="bankState"
                label="State"
                errors={errors}
                register={register}
              />
            </div>
            <div className="mobile-lg:grid-col-4">
              <DoulaAddressZip
                name="bankZip"
                label="ZIP Code"
                value={bankZip}
                errors={errors}
                register={register}
              />
            </div>
          </div>
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <DirectDepositExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Account information</h2>
          <p>This is the bank account where we will send your payments.</p>

          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="nameOnBankAccount"
              label="Name on bank account"
              hint="This should be your name"
              required
              errors={errors}
              register={register}
            />
          </div>
          <div className="margin-top-3">
            <Checkbox
              id="hasJointBankAccount"
              label="I have a joint bank account"
              defaultChecked={hasJointBankAccount}
              {...register("hasJointBankAccount")}
            />
          </div>
          {hasJointBankAccount && (
            <div className="tablet:grid-col-6">
              <DoulaTextInput
                name="secondNameOnJointBankAccount"
                label="Second name on joint bank account"
                hint="This should be someone else's name"
                required
                errors={errors}
                register={register}
              />
            </div>
          )}
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-6">
              <DoulaTextInput
                name="bankRoutingNumber"
                label="Bank routing number"
                hint="See reference image below"
                numericOnly
                required
                errors={errors}
                register={register}
                additionalRegisterOptions={{
                  validate: (value) => {
                    if (value.toString().trim().length !== 9) {
                      return `Bank routing number must have 9 digits`;
                    }
                    return true;
                  },
                }}
              />
            </div>
            <div className="mobile-lg:grid-col-6">
              <DoulaTextInput
                name="bankAccountNumber"
                label="Bank account number"
                hint="See reference image below"
                numericOnly
                required
                errors={errors}
                register={register}
                additionalRegisterOptions={{
                  validate: (value) => {
                    if (value.toString().trim().length < 4 || value.toString().trim().length > 18) {
                      return `Bank account number must have between 4 and 18 digits`;
                    }
                    return true;
                  },
                }}
              />
            </div>
          </div>
          <div className="margin-top-3">
            <p className="usa-hint">
              Please reference the image below to find your account numbers.
            </p>
            <img
              src="/img/voided_check.png"
              width={568}
              height={355}
              alt="Routing and account numbers can be found on the bottom left of the check. Write VOID on the check."
            />
          </div>
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <BankAccountExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default PersonalStep4;
