import { type AccordionItemProps } from "node_modules/@trussworks/react-uswds/lib/components/Accordion/Accordion";

export const faqContent: AccordionItemProps[] = [
  {
    title:
      "Which Managed Care Organizations can I contract with once my FFS application is approved?",
    content: (
      <ul>
        <li>Aetna</li>
        <li>Fidelis Care</li>
        <li>Horizon Blue Cross Blue Shield</li>
        <li>United Healthcare Community Plan</li>
        <li>Wellpoint</li>
      </ul>
    ),
    expanded: false,
    id: "faq_which_mcos",
    headingLevel: "h4",
  },
  {
    title: "Am I eligible to become an NJ FamilyCare doula?",
    content: (
      <p>
        To become an NJ FamilyCare community doula, you must complete{" "}
        <a
          href="https://www.nj.gov/humanservices/dmahs/info/NJFC_Approved_Doula_Trainings.pdf"
          target="_blank"
          rel="noopener"
        >
          the NJ FamilyCare doula trainings
        </a>{" "}
        and the adult/infant CPR certification from the{" "}
        <a
          href="https://www.redcross.org/take-a-class/cpr/cpr-training/cpr-certification?srsltid=AfmBOoo7HKuiYPQEFBAYRiU_O-cVB8ZjF4dd5H-4JT1JHpw-HrrSc_Gu"
          target="_blank"
          rel="noopener"
        >
          American Red Cross
        </a>{" "}
        or{" "}
        <a href="https://cpr.heart.org/en/" target="_blank" rel="noopener">
          American Heart Association
        </a>
        . 
      </p>
    ),
    expanded: false,
    id: "faq_am_i_eligible",
    headingLevel: "h4",
  },
  {
    title:
      "Can I be an NJ FamilyCare doula if my residence or business address is not in New Jersey?",
    content: (
      <p>
        Yes, you can. Out-of-state practice doesn&apos;t impact your eligibility for FFS, but you
        must take the mandatory trainings.
      </p>
    ),
    expanded: false,
    id: "faq_address_not_in_nj",
    headingLevel: "h4",
  },
  {
    title: "What is an NPI number?",
    content: (
      <>
        <p>
          A National Provider Identifier (NPI) is a unique 10-digit identification number assigned
          to healthcare providers in the U.S., provided by the Centers for Medicare & Medicaid
          Services.
        </p>
        <p>
          You can get yours visiting the National Plan and Provider Enumeration System (NPPES) site:
          <a href="https://nppes.cms.hhs.gov/" target="_blank" rel="noopener">
            https://nppes.cms.hhs.gov/
          </a>
          . For doulas, the NPI has to be Type 1 and the doula taxonomy code is 374J00000X.
        </p>
      </>
    ),
    expanded: false,
    id: "faq_what_is_npi",
    headingLevel: "h4",
  },
  {
    title: "How can I add the taxonomy code to my NPI number?",
    content: (
      <ol>
        <li>Register or log in to the NPPES website.</li>
        <li>On the provider information page, select the NPI you wish to modify.</li>
        <li>
          Navigate to the Taxonomy page, and in the Taxonomy Filter box, enter the code 374J00000X.
        </li>
        <li>Follow NPPES instructions to link this code to your NPI and save the changes.</li>
      </ol>
    ),
    expanded: false,
    id: "faq_how_can_i_add_taxonomy",
    headingLevel: "h4",
  },
  {
    title: "What is a Sole Proprietorship business type?",
    content: (
      <>
        <p>
          Even if you are a single doula working by yourself, you are considered a business. The{" "}
          <span className="text-bold">Sole Proprietorship business type</span> is a common starting
          point. It means that:
        </p>
        <ul>
          <li>You are only one doula who owns and runs the business.</li>
          <li>You don&apos;t have employees.</li>
          <li>Your business has no co-owners.</li>
          <li>You keep all profits and are responsible for any debts or legal issues.</li>
        </ul>
      </>
    ),
    expanded: false,
    id: "faq_what_is_sole_proprietorship",
    headingLevel: "h4",
  },
  {
    title: "What can I do if I’m not a Sole Proprietor?",
    content: (
      <p>
        This site is currently for individual doulas operating as Sole Proprietors. If you have an
        LLC or another business type, please use the standard{" "}
        <a href="https://www.njmmis.com/providerEnrollment.aspx" target="_blank" rel="noopener">
          Medicaid Fee-for-Service application
        </a>
        .
      </p>
    ),
    expanded: false,
    id: "faq_what_if_not_sole_proprietorship",
    headingLevel: "h4",
  },
  {
    title: "Where should I get my doula liability insurance?",
    content: (
      <p>
        We encourage you to connect with your training organization so they can recommend available
        doula insurances.
      </p>
    ),
    expanded: false,
    id: "faq_where_get_insurance",
    headingLevel: "h4",
  },
  {
    title: "What type of insurance do I need to complete my FFS application?",
    content: (
      <p>
        You need active doula liability insurance. This insurance must not expire within 3 months of
        your FFS application submission and must have a minimum coverage of $1 million per
        occurrence and $3 million aggregate.
      </p>
    ),
    expanded: false,
    id: "faq_what_type_of_insurance",
    headingLevel: "h4",
  },
  {
    title: "How many applications do I need to complete?",
    content: (
      <>
        <p>
          You&apos;ll start with one individual NJ FamilyCare Fee-for-Service (FFS) application.
          Approval enrolls you to serve FFS members. To serve all pregnant NJ FamilyCare members
          (most are in managed care), we encourage joining{" "}
          <a
            href="https://www.nj.gov/humanservices/dmahs/info/NJFC_Doula_4Contracting.pdf"
            target="_blank"
            rel="noopener"
          >
            all five Managed Care Organizations (MCOs)
          </a>
          .
        </p>
        <p>
          Your FFS application will NOT be sent to MCOs automatically; you&apos;ll need to complete
          their applications separately, which you can do visiting the{" "}
          <a
            href="https://www.nj.gov/humanservices/dmahs/info/resources/care/"
            target="_blank"
            rel="noopener"
          >
            Department of Human Services website
          </a>
          .
        </p>
      </>
    ),
    expanded: false,
    id: "faq_how_many_applications",
    headingLevel: "h4",
  },
  {
    title: "What if my FFS application is closed?",
    content: (
      <p>
        You&apos;re welcome to re-apply anytime. For questions, please email the Doula Guides team
        at
        <a href="mailto:mahs.doulaguide@dhs.nj.gov" target="_blank" rel="noopener">
          mahs.doulaguide@dhs.nj.gov
        </a>
        .
      </p>
    ),
    expanded: false,
    id: "faq_what_if_ffs_is_closed",
    headingLevel: "h4",
  },
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
          <a
            href="https://www.njmmis.com/providerDirectory.aspx?nonBilling=False"
            target="_blank"
            rel="noopener"
          >
            www.njmmis.com
          </a>
          ), where street addresses are removed, but city, state, and zip remain. MCOs also list
          doulas in their directories, removing street addresses.
        </p>
        <p>To keep your addresses private consider using a P.O. box.</p>
      </>
    ),
    expanded: false,
    id: "faq_will_my_information_public",
    headingLevel: "h4",
  },
  {
    title: "Where can I find more information or get help?",
    content: (
      <p>
        You can contact the Doula Guides team via email at{" "}
        <a href="mailto:mahs.doulaguide@dhs.nj.gov" target="_blank" rel="noopener">
          mahs.doulaguide@dhs.nj.gov
        </a>
      </p>
    ),
    expanded: false,
    id: "faq_how_can_i_get_help",
    headingLevel: "h4",
  },
];
