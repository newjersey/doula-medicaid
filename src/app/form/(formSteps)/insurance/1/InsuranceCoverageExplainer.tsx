import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const insuranceCoverageItems: AccordionItemProps[] = [
  {
    title: "Where should I get my doula liability insurance?",
    content: (
      <p>
        We encourage you to connect with your training organization so they can recommend available
        doula insurances.
      </p>
    ),
    expanded: false,
    id: "whereShouldIGetInsurance",
    headingLevel,
  },
];

const InsuranceCoverageExplainer = () => {
  return <Accordion bordered={true} items={insuranceCoverageItems} />;
};

export default InsuranceCoverageExplainer;
