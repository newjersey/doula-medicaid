import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const directDepositExplainerItems: AccordionItemProps[] = [
  {
    title: "When will I receive my first direct deposit payment?",
    content: (
      <p>
        Direct deposits can take up to 4 weeks to process. You may still receive a paper check in
        the meantime.
      </p>
    ),
    expanded: false,
    id: "whenWillIReceiveMyFirstDirectDepositPayment",
    headingLevel,
  },
  {
    title: "How can I change my bank account information in the future?",
    content: (
      <p>
        Email Gainwell Technologies at{" "}
        <a
          id="njmmisEmail"
          href="mailto:njmmisproviderenrollment@gainwelltechnologies.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          njmmisproviderenrollment@gainwelltechnologies.com
        </a>{" "}
        if you need to change your direct deposit bank information in the future.
      </p>
    ),
    expanded: false,
    id: "howCanIChangeMyBankAccountInformationInTheFuture",
    headingLevel,
  },
];

const DirectDepositExplainer = () => {
  return <Accordion bordered={true} items={directDepositExplainerItems} />;
};

export default DirectDepositExplainer;
