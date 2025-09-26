"use client";

import { formatFormProgressUrl, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Button, ButtonGroup } from "@trussworks/react-uswds";
import { NavLink } from "react-router";

const FormProgressButtons = () => {
  const formProgressPosition = useFormProgressPosition();

  const buttons: Array<React.ReactNode> = [];
  if (formProgressPosition.previous !== null) {
    buttons.push(
      <NavLink
        key="previous"
        to={formatFormProgressUrl(formProgressPosition.previous)}
        className="usa-button usa-button--outline margin-top-0"
      >
        Previous
      </NavLink>,
    );
  }
  if (formProgressPosition.next !== null) {
    buttons.push(
      <Button key="next" type="submit" className="margin-top-0">
        Next
      </Button>,
    );
  }

  return (
    <>
      <div className="margin-top-4 display-flex flex-column flex-align-end">
        <ButtonGroup type="default">{buttons}</ButtonGroup>
      </div>
    </>
  );
};

export default FormProgressButtons;
