import { Accordion, type HeadingLevel } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const JuiceShopExplainer = (props: { headingLevel: HeadingLevel }) => {
  const juiceShopExplainerItems: AccordionItemProps[] = [
    {
      title: "What is the juice shop?",
      content: (
        <p>
          The OWASP Juice Shop is a deliberately insecure web application that can be used in
          security trainings, awareness demos, CTFs and as a guinea pig for security tools. You can
          find out more{" "}
          <a href="https://owasp.org/www-project-juice-shop/" target="_blank">
            here
          </a>
          .
        </p>
      ),
      expanded: false,
      id: "whatIsTheJuiceShop",
      headingLevel: props.headingLevel,
    },
    {
      title: "Am I supposed to know of this juice shop?",
      content: (
        <>
          <p>
            Maybe! If you were here for the cybersecurity workshop on April 23, 2025, you would have
            gone through the exercise of running the juice shop and finding security
            vulnerabilities.
          </p>
        </>
      ),
      expanded: false,
      id: "amISupposedToKnowOfThisJuiceShop",
      headingLevel: props.headingLevel,
    },
    {
      title: "Should I get distracted and do the juice shop workshop now?",
      content: <p>No. But maybe later, if you&apos;re interested.</p>,
      expanded: false,
      id: "shouldIGetDistractedAndDoTheJuiceShopWorkshopNow",
      headingLevel: props.headingLevel,
    },
  ];
  return <Accordion bordered={true} items={juiceShopExplainerItems} multiselectable={true} />;
};

export default JuiceShopExplainer;
