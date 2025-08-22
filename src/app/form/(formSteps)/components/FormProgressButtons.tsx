"use client";

import { formatFormProgressUrl, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Button, ButtonGroup } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";

const FormProgressButtons: React.FC = () => {
  const formProgressPosition = useFormProgressPosition();
  const router = useRouter();

  return (
    <>
      <div className="display-flex flex-column flex-align-end">
        <div className="right-align">
          <ButtonGroup type="default">
            {formProgressPosition.previous !== null && (
              <Button
                key="previous"
                onClick={() => {
                  if (formProgressPosition.previous !== null) {
                    router.push(formatFormProgressUrl(formProgressPosition.previous));
                    router.refresh();
                  }
                }}
                type="button"
                className="usa-button usa-button--outline margin-top-0"
              >
                Previous
              </Button>
            )}
            {formProgressPosition.next !== null && (
              <Button key="next" type="submit" className="margin-top-0">
                Next
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default FormProgressButtons;
