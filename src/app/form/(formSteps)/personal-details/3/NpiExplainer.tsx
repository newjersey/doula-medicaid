import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const npiExplainerItems: AccordionItemProps[] = [
  {
    title: "What is an NPI?",
    content: (
      <p>
        A National Provider Identifier (NPI) is a unique 10-digit identification number assigned to
        healthcare providers in the U.S., provided by the Centers for Medicare & Medicaid Services.
      </p>
    ),
    expanded: false,
    id: "whatIsAnNpi",
    headingLevel,
  },
  {
    title: "Where can I get my NPI?",
    content: (
      <>
        <p>
          Visit the National Plan and Provider Enumeration System (NPPES) site:
          <a href="https://nppes.cms.hhs.gov/" target="_blank" rel="noopener">
            https://nppes.cms.hhs.gov/
          </a>
        </p>
        <p>You can verify its authenticity as it is an official .gov site.</p>
      </>
    ),
    expanded: false,
    id: "whereCanIGetMyNpi",
    headingLevel,
  },
  {
    title: "What is the doula taxonomy code?",
    content: <p>The doula taxonomy code is 374J00000X.</p>,
    expanded: false,
    id: "whatIsTheDoulaTaxonomyCode",
    headingLevel,
  },
  {
    title: "How can I add the taxonomy code?",
    content: (
      <ol>
        <li>
          Register or log in to the{" "}
          <a href="https://nppes.cms.hhs.gov/" target="_blank" rel="noopener">
            NPPES website
          </a>
          .
        </li>
        <li>On the provider information page, select the NPI you wish to modify.</li>
        <li>
          Navigate to the Taxonomy page, and in the Taxonomy Filter box, enter the code 374J00000X.
        </li>
        <li>Follow NPPES instructions to link this code to your NPI and save the changes.</li>
      </ol>
    ),
    expanded: false,
    id: "howCanIAddTheTaxonomyCode",
    headingLevel,
  },
  {
    title: "Is the information in my NPI public?",
    content: (
      <>
        <p>Yes, information about healthcare providers National Provider Identifiers is public.</p>
        <p>To keep your addresses private consider using a P.O. box.</p>
      </>
    ),
    expanded: false,
    id: "isTheInformationInMyNpiPublic",
    headingLevel,
  },
];

const NpiExplainer = () => {
  return <Accordion bordered={true} items={npiExplainerItems} multiselectable={true} />;
};

export default NpiExplainer;
