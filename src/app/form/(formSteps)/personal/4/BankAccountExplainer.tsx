import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const bankAccountExplainerItems: AccordionItemProps[] = [
  {
    title: "What documents can I use to verify my bank account information?",
    content: (
      <>
        <p>
          You need to provide a{" "}
          <span className="text-bold">blank and voided check or a statement from your bank</span>{" "}
          that verifies the information you provided in this form.
        </p>
        <p>Further instructions will appear on the cover sheet of your application.</p>
      </>
    ),
    expanded: false,
    id: "whatDocumentsCanIUseToVerifyMyBankAccountInformation",
    headingLevel,
  },
];

const BankAccountExplainer = () => {
  return <Accordion bordered={true} items={bankAccountExplainerItems} />;
};

export default BankAccountExplainer;
