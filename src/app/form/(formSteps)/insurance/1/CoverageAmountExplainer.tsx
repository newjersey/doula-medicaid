import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const coverageAmountExplainerItems: AccordionItemProps[] = [
  {
    title: `What is "amount per occurrence" and "amount per aggregate"?`,
    content: (
      <div>
        <p>
          You can find the &quot;per occurrence&quot; and &quot;aggregate&quot; limits for your
          professional liability insurance in the following places:
        </p>
        <ul>
          <li>
            Your Certificate of Insurance (COI), a one-page document that provides proof of
            coverage.
          </li>
          <li>
            Your Insurance Policy Declarations Page, typically in the first section of your
            insurance documents.
          </li>
          <li>Your Online Insurance Account, or by emailing or calling your insurance provider.</li>
        </ul>
      </div>
    ),
    expanded: false,
    id: "whatIsAmountPerOccurance",
    headingLevel,
  },
];

const CoverageAmountExplainer = () => {
  return <Accordion bordered={true} items={coverageAmountExplainerItems} />;
};

export default CoverageAmountExplainer;
