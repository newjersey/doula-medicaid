import { WelcomeFaq } from "@/app/form/(formSteps)/welcome/WelcomeFaq";
import {
  formatFormProgressUrl,
  useFormProgressPosition,
} from "@/app/form/_utils/formProgressRouting";
import {
  Icon,
  IconList,
  IconListContent,
  IconListIcon,
  IconListItem,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
} from "@trussworks/react-uswds";
import { NavLink } from "react-router";

const WelcomeSection = () => {
  const formProgressPosition = useFormProgressPosition();

  if (formProgressPosition.next === null) {
    throw new Error(`Unexpected no next page found for ${formProgressPosition.current}`);
  }

  return (
    <div className="grid-container welcome-page">
      <div className="grid-row">
        <div className="tablet:grid-col bg-primary-lightest padding-6">
          <h1 className="text-primary-darkest font-heading-2xl">
            Welcome to the NJ Doula Assistant
            <span className="display-block text-primary font-heading-2xl margin-top-0">
              Focus on care, not paperwork
            </span>
          </h1>
          <div className="grid-row flex-no-wrap">
            <div className="padding-right-1">
              <Icon.Alarm aria-hidden="true" size={3} />
            </div>
            <div className="font-body-lg text-normal margin-top-0 margin-bottom-6">
              Take 20 minutes to start your Fee-for-Service (FFS) application to become an NJ
              FamilyCare community doula.
            </div>
          </div>
          <h2 className="font-heading-md">What you need to use this tool</h2>
          <IconList className="usa-icon-list--size-sm margin-bottom-6">
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Be an individual doula operating as a{" "}
                <span className="text-bold">Sole Proprietor</span>.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Proof of{" "}
                <a
                  href="https://cpr.heart.org/en"
                  target="_blank"
                  rel="noreferrer noreferrer"
                  className="usa-link usa-link--external"
                >
                  CPR (adult/infant)
                </a>
                ,{" "}
                <a
                  href="https://www.snjpc.org/doulaentrypage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="usa-link usa-link--external"
                >
                  HIPAA
                </a>
                , and{" "}
                <a
                  href="https://www.nj.gov/humanservices/dmahs/info/NJFC_Approved_Doula_Trainings.pdf"
                  target="_blank"
                  rel="noopener"
                  className="usa-link"
                >
                  <span className="usa-sr-only">opens in a new tab.</span>
                  doula training
                </a>{" "}
                completion.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Your NPI number: must be <span className="text-bold">Type 1</span>, using the doula{" "}
                <span className="text-bold">taxonomy code: 374J00000X</span>.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Proof of your active{" "}
                <a
                  href="https://www.nj.gov/humanservices/dmahs/info/Newsletter_31-04_Doula.pdf"
                  target="_blank"
                  rel="noopener"
                  className="usa-link"
                >
                  <span className="usa-sr-only">opens in a new tab.</span>
                  doula liability insurance
                </a>
                .
              </IconListContent>
            </IconListItem>
          </IconList>
          <NavLink
            key="start"
            to={formatFormProgressUrl(formProgressPosition.next)}
            className="usa-button margin-top-0"
            onClick={() => gtag("event", "progressStart")}
          >
            Start now
          </NavLink>
        </div>
      </div>

      <h2 className="font-heading-xl">How it works</h2>

      <div className="grid-row">
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              Click “Start Now” to begin your Fee-For-Service (FFS) application process
            </ProcessListHeading>
            <p>
              This website will help you complete your FFS application forms in just 20 minutes
              using language that is easy to understand.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              Download, review, and sign your application
            </ProcessListHeading>
            <p>
              You should review, make any updates, and sign your downloaded application forms before
              you submit. Follow instructions on the cover page of your downloaded application
              packet.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              Email your signed application and attached documents
            </ProcessListHeading>
            <p>
              This website will not submit your application. Email your completed application packet
              to{" "}
              <a href="mailto:mahs.doulaguide@dhs.nj.gov" target="_blank" rel="noopener">
                mahs.doulaguide@dhs.nj.gov
              </a>{" "}
              and{" "}
              <a
                id="njmmisEmail"
                href="mailto:njmmisproviderenrollment@gainwelltechnologies.com"
                target="_blank"
                rel="noopener"
              >
                njmmisproviderenrollment@gainwelltechnologies.com
              </a>{" "}
              simultaneously.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              Complete your free background check and fingerprinting
            </ProcessListHeading>
            <p>
              After you submit your application, a Doula Guide will email instructions to complete
              this step in a local office. You will submit the receipt.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">Receive your NJ Medicaid ID</ProcessListHeading>
            <p>
              Once Gainwell approves your application, you will receive a letter with your NJ
              Medicaid ID.
            </p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              Apply to Managed Care Organizations (MCOs)
            </ProcessListHeading>
            <p>
              Once you receive your NJ Medicaid ID, you can apply to contract with any Managed Care
              Organization (MCO).
            </p>
          </ProcessListItem>
        </ProcessList>
      </div>

      <h2 className="font-heading-xl">FAQs</h2>
      <WelcomeFaq headingLevel="h3" />
    </div>
  );
};

export default WelcomeSection;
