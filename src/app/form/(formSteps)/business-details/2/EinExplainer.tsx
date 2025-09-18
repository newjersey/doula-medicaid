import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const einExplainerItems: AccordionItemProps[] = [
  {
    title: "What is an Employee Identification Number (EIN)?",
    content: (
      <p>
        This is a Tax ID issued by the IRS. If you don’t have one, we will use your SSN as your Tax
        ID.
      </p>
    ),
    expanded: false,
    id: "whatIsAnEmployeeIdentificationNumber",
    headingLevel,
  },
];

const EinExplainer = () => {
  return <Accordion bordered={true} items={einExplainerItems} />;
};

export default EinExplainer;
