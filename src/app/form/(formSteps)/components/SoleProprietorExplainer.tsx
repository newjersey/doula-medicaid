import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const soleProprietorExplainerItems: AccordionItemProps[] = [
  {
    title: "What is a Sole Proprietorship business type?",
    content: (
      <>
        Even if you are a single doula working by yourself, you are considered a business. The Sole
        Proprietorship business type is a common starting point. It means that:
        <ul>
          <li>You are only one doula who owns and runs the business.</li>
          <li>You don&apos;t have employees.</li>
          <li>Your business has no co-owners.</li>
          <li>You keep all profits and are responsible for any debts or legal issues.</li>
        </ul>
      </>
    ),
    expanded: false,
    id: "whatIsASoleProprietor",
    headingLevel,
  },
  {
    title: "What can I do if I’m not a Sole Proprietor?",
    content: (
      <>
        <p>This beta site is for doulas operating as Sole Proprietors.</p>
        <p>
          If you have an LLC or another business type, use the standard{" "}
          <a
            href="https://www.njmmis.com/providerEnrollment.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="usa-link usa-link--external"
          >
            Medicaid Fee-for-Service application
          </a>
          .
        </p>
      </>
    ),
    expanded: false,
    id: "whatToDoIfImNotASoleProprietor",
    headingLevel,
  },
];

const SoleProprietorExplainer = () => {
  return <Accordion bordered={true} items={soleProprietorExplainerItems} />;
};

export default SoleProprietorExplainer;
