import { Accordion, type HeadingLevel } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const AddressExplainer = (props: { headingLevel: HeadingLevel }) => {
  const addressExplainerItems: AccordionItemProps[] = [
    {
      title: "How will my mailing address be used?",
      content: (
        <p>
          It won&apos;t be used for anything 😛. This app is just to demonstrate accessibility,
          absolutely nothing will happen to the stuff that you put into these forms.
        </p>
      ),
      expanded: false,
      id: "howWillMyMailingAddressBeUsed",
      headingLevel: props.headingLevel,
    },
  ];
  return <Accordion bordered={true} items={addressExplainerItems} multiselectable={true} />;
};

export default AddressExplainer;
