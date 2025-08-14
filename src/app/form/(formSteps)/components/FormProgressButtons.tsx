"use client";

import { formatFormProgressUrl, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Button, ButtonGroup, Link } from "@trussworks/react-uswds";

const FormProgressButtons: React.FC = () => {
  const formProgressPosition = useFormProgressPosition();

  const buttons: Array<React.ReactNode> = [];
  if (formProgressPosition.previous !== null) {
    buttons.push(
      <Link
        key="previous"
        href={formatFormProgressUrl(formProgressPosition.previous)}
        className="usa-button usa-button--outline margin-top-0"
      >
        Previous
      </Link>,
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
