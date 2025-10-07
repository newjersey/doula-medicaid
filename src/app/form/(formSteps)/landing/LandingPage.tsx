import {
  formatFormProgressUrl,
  useFormProgressPosition,
} from "@/app/form/_utils/formProgressRouting";
import { NavLink } from "react-router";

const LandingPage = () => {
  const formProgressPosition = useFormProgressPosition();

  return (
    <div>
      <h1>Welcome to the Doula Medicaid Application</h1>
      <NavLink
        key="start"
        to={formatFormProgressUrl(formProgressPosition.next!)}
        className="usa-button usa-button--outline margin-top-0"
      >
        Start now
      </NavLink>
    </div>
  );
};

export default LandingPage;
