import { Accordion } from "@trussworks/react-uswds";
import type { AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

const headingLevel = "h3";
const publicInformationExplainerItems: AccordionItemProps[] = [
  {
    title: "Will my information be public?",
    content: (
      <>
        <p>
          Partially, yes. The information that you share in this website is encrypted, it stays
          private. But some information will be public because when you receive an NPI (National
          Provider Identifier), your contact and NPI details will be listed on the national National
          Plan and Provider Enumeration System (NPPES) NPI Registry. If you use your home address as
          your mailing and/or business address, it will be public.
        </p>
        <p>
          NJ FamilyCare doesn&apos;t control NPPES listings. Once enrolled, you&apos;ll also appear
          on the NJ FamilyCare FFS Provider Directory (
          <a href="https://www.njmmis.com/" target="_blank" rel="noopener">
            www.njmmis.com
          </a>
          ), where street addresses are removed, but city, state, and zip remain. MCOs also list
          doulas in their directories, removing street addresses.
        </p>
        <p>To keep your addresses private consider using a P.O. box.</p>
      </>
    ),
    expanded: false,
    id: "willMyInformationBePublic",
    headingLevel,
  },
];

const PublicInformationExplainer = () => {
  return (
    <Accordion bordered={true} items={publicInformationExplainerItems} multiselectable={true} />
  );
};

export default PublicInformationExplainer;
