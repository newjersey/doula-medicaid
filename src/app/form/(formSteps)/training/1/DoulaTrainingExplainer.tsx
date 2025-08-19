import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const doulaExplainerItems: AccordionItemProps[] = [
  {
    title: "What if my doula training isn't listed here?",
    content: (
      <>
        <p>
          You can still enter your training organization, but you might not be eligible at the time.
        </p>
        <p>Contact the Doula Guides to learn more: mahs.doulaguide@dhs.nj.gov</p>
      </>
    ),
    expanded: false,
    id: "whatIfMyDoulaTrainingIsNotListed",
    headingLevel,
  },
  {
    title: "What are the state-approved doula trainings?",
    content: (
      <p>
        Check the updated list of{" "}
        <a
          href="https://www.nj.gov/humanservices/dmahs/info/NJFC_Approved_Doula_Trainings.pdf"
          target="_blank"
          rel="noopener"
        >
          NJ Family Care doula trainings
        </a>{" "}
        on the State of New Jersey Department of Human Services website.
      </p>
    ),
    expanded: false,
    id: "whatAreTheStateApprovedDoulaTrainings",
    headingLevel,
  },
];

const DoulaTrainingExplainer = () => {
  return <Accordion bordered={true} items={doulaExplainerItems} />;
};

export default DoulaTrainingExplainer;
