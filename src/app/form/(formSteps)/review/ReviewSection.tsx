import { ValueNotFoundError } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { fillFfsIndividualForm } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { getFormData } from "@/app/form/_utils/fillPdf/form";
// import { AddressState } from "@/app/form/_utils/inputFields/addressState";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useEffect, useState } from "react";

const ReviewSection = () => {
  const [downloadData, setDownloadData] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const [hasMissingValues, setHasMissingValues] = useState<boolean>(false);
  const { dataStore } = useDataStore();

  const stringifiedDataStore = JSON.stringify(dataStore);
  useEffect(() => {
    (async () => {
      try {
        const formData = getFormData(JSON.parse(stringifiedDataStore));
        // const formData = {
        //   isSupportedSoleProprietor: true,
        //   insuranceStartDate: new Date("1988-07-06T03:00:00.000Z"),
        //   insuranceEndDate: new Date("2025-03-02T04:00:00.000Z"),
        //   insuranceOccurenceAmount: "1000005",
        //   insuranceAggregateAmount: "3000300",
        //   insuranceCarrierName: "Test insurance carrier",
        //   insurancePolicyNumber: "ABC-12345",
        //   insuranceStreetAddress1: "Test insurance address 1",
        //   insuranceStreetAddress2: "Test insurance address 2",
        //   insuranceCity: "Test insurance city",
        //   insuranceState: AddressState.NJ,
        //   insuranceZip: "12345",
        //   stateApprovedTraining: "Children's Futures (Trenton)",
        //   nameOfTrainingOrganization: null,
        //   isDoulaTrainingInPerson: false,
        //   trainingStreetAddress1: null,
        //   trainingStreetAddress2: null,
        //   trainingCity: null,
        //   trainingState: null,
        //   trainingZip: null,
        //   instructorFirstName: "Jane",
        //   instructorLastName: "Doe",
        //   instructorEmail: "test@example.com",
        //   instructorPhoneNumber: "111-111-1111",
        //   firstName: "Test first name",
        //   middleName: "Test middle name",
        //   lastName: "Test last name",
        //   dateOfBirth: new Date("1988-07-06T03:00:00.000Z"),
        //   socialSecurityNumber: "123-45-6789",
        //   email: "test@test.com",
        //   phoneNumber: "321-123-4567",
        //   streetAddress1: "Test address 1",
        //   streetAddress2: "Test address 2",
        //   city: "Test city",
        //   state: AddressState.PA,
        //   zip: "12345",
        //   billingStreetAddress1: "Test address 1",
        //   billingStreetAddress2: "Test address 2",
        //   billingCity: "Test city",
        //   billingState: AddressState.PA,
        //   billingZip: "12345",
        //   npiNumber: "1111111111",
        //   medicareProviderId: "ABC12345",
        //   upinNumber: "12345",
        //   bankName: "Test bank name",
        //   bankCity: "Test bank city",
        //   bankState: AddressState.PA,
        //   bankZip: "11111",
        //   nameOnBankAccount: "The fancy name on my bank account",
        //   hasJointBankAccount: false,
        //   secondNameOnJointBankAccount: null,
        //   bankRoutingNumber: "123456789",
        //   bankAccountNumber: "11111111111",
        //   businessStreetAddress1: "Test address 1",
        //   businessStreetAddress2: "Test address 2",
        //   businessCity: "Test city",
        //   businessState: AddressState.PA,
        //   businessZip: "12345",
        //   hasDisclosableEvent: false,
        //   hasFiledBankruptcy: false,
        //   pastBankruptcyDate: null,
        //   mightFileBankruptcy: false,
        //   futureBankruptcyDate: null,
        //   isEmployedByNj: false,
        //   employedByNjExplanation: null,
        //   hasProvidedMedicaidServices: false,
        //   medicaidProviderExplanation: null,
        //   hasCrimeCharge: false,
        //   crimeChargeExplanation: null,
        //   hadLicenseSuspended: false,
        //   licenseSuspendedExplanation: null,
        //   hasDisqualification: false,
        //   disqualificationExplanation: null,
        //   hasCompanyInvolvement: false,
        //   companyInvolvementExplanation: null,
        // };

        setHasMissingValues(false);
        const filledFfsIndividualForm = await fillFfsIndividualForm(formData);
        setDownloadData({
          /**
           * `filledFfsIndividualForm.bytes` is a `Uint8Array<ArrayBufferLike>`.
           *
           * Wrapping it in another `new Uint8Array()` is needed to convert it to a
           * `Uint8Array<ArrayBuffer>` (no "Like"), which the Blob constructor wants.
           * https://github.com/microsoft/TypeScript/pull/59417
           */
          url: URL.createObjectURL(new Blob([new Uint8Array(filledFfsIndividualForm.bytes)])),
          filename: filledFfsIndividualForm.filename,
        });
      } catch (e) {
        if (e instanceof ValueNotFoundError) {
          setHasMissingValues(true);
        } else {
          throw e;
        }
      }
    })();
  }, [stringifiedDataStore]);

  return (
    <div className="margin-top-5 margin-bottom-5">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {downloadData === null && hasMissingValues === false && (
          <>
            <h1 className="font-heading-lg">Filling your application...</h1>
          </>
        )}
        {hasMissingValues && (
          <>
            <h1 className="font-heading-lg">Some form fields are missing</h1>
            <p>Please go through previous steps and fill all required fields.</p>
          </>
        )}
        {downloadData && (
          <>
            <div className="font-heading-2xl">🎉</div>
            <h1 className="font-heading-lg">Great job! Next, download your application.</h1>
            <p style={{ textAlign: "center" }}>
              Download your pre-filled application forms and follow the instructions on the cover
              page to complete and submit your Medicaid Fee-for-Service application.
            </p>
            <a
              href={downloadData.url}
              download={downloadData.filename}
              className="usa-button margin-right-0 margin-top-4"
              onClick={() => gtag("event", "downloadApplication")}
            >
              Download your application
            </a>
          </>
        )}
        <FormProgressButtons overrideClassNames="margin-top-2" />
      </div>
    </div>
  );
};

export default ReviewSection;
