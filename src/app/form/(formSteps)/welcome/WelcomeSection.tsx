import {
  formatFormProgressUrl,
  useFormProgressPosition,
} from "@/app/form/_utils/formProgressRouting";
import { NavLink } from "react-router";

const WelcomeSection = () => {
  const formProgressPosition = useFormProgressPosition();

  if (formProgressPosition.next === null) {
    throw new Error(`Unexpected no next page found for ${formProgressPosition.current}`);
  }

  return (
    <div>
      <h1>Welcome to the Doula Medicaid Application</h1>
      <NavLink
        key="start"
        to={formatFormProgressUrl(formProgressPosition.next)}
        className="usa-button usa-button--outline margin-top-0"
      >
        Start now
      </NavLink>
    </div>
  );
};

export default WelcomeSection;
