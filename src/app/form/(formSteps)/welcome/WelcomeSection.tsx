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
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col bg-primary-lightest padding-6">
          <h1 className="text-primary-darkest font-heading-2xl margin-bottom-0">
            Welcome to the NJ Doula Assistant
          </h1>
          <h2 className="text-primary font-heading-2xl margin-top-0">
            Focus on care, not paperwork
          </h2>
          <div>
            <h2 className="font-body-lg text-normal margin-bottom-6">
              <Icon.Alarm aria-hidden="true" /> Take 20 minutes to start your Fee-for-Service (FFS)
              application <br /> to become an NJ FamilyCare community doula.
            </h2>
          </div>

          <h3 className="font-body-small">What you need to use this tool</h3>
          <IconList className="usa-icon-list--size-sm margin-bottom-6">
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Be an individual doula operating as a Sole Proprietor.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Proof of CPR (adult/infant), HIPAA, and doula training completion.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>
                Your NPI number: must be Type 1, using the doula taxonomy code: 374J00000X.
              </IconListContent>
            </IconListItem>
            <IconListItem>
              <IconListIcon className="text-green">
                <Icon.CheckCircle aria-hidden="true" />
              </IconListIcon>
              <IconListContent>Proof of your active doula liability insurance.</IconListContent>
            </IconListItem>
          </IconList>
          <NavLink
            key="start"
            to={formatFormProgressUrl(formProgressPosition.next)}
            className="usa-button margin-top-0"
          >
            Start now
          </NavLink>
        </div>
      </div>

      <h3 className="font-heading-xl">How it works</h3>

      <div className="grid-row">
        <div className="tablet:grid-col-6">
          <ProcessList>
            <ProcessListItem>
              <ProcessListHeading type="h4">
                Complete your FFS application packet
              </ProcessListHeading>
              <p>
                Gather the required documents, we'll guide you through the FFS application on this
                website.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h4">Email your FFS application packet</ProcessListHeading>
              <p>
                Send forms to mahs.doulaguide@dhs.nj.gov and
                njmmisproviderenrollment@gainwelltechnologies.com simultaneously. Keep an eye on
                your inbox!
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h4">
                Free background check and fingerprinting
              </ProcessListHeading>
              <p>
                After you submit your FFS application, a Doula Guide will email instructions to
                complete this step in a local office and submit your receipt.
              </p>
            </ProcessListItem>
          </ProcessList>
        </div>
        <div className="tablet:grid-col-6">
          <ProcessList>
            <ProcessListItem>
              <ProcessListHeading type="h4">Receive your NJ Medicaid ID</ProcessListHeading>
              <p>
                Once we approve your FFS application, we will send you a letter with your NJ
                Medicaid ID.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h4">
                Apply to Managed Care Organizations (MCOs)
              </ProcessListHeading>
              <p>Once you receive your NJ Medicaid ID, you can apply to the MCOs.</p>
            </ProcessListItem>
          </ProcessList>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
