"use client";

import { getCurrentFormProgress } from "@/app/form/_utils/formProgress";
import { Alert } from "@trussworks/react-uswds";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const WipBanner = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const sectionsIdsWithBanner = ["welcome"];

  const [pageIsLoaded, setPageIsLoaded] = useState(false);

  useEffect(() => {
    setPageIsLoaded(true);
  }, []);

  if (!pageIsLoaded || pathParts.length !== 3) {
    return <></>;
  }

  const { section: currentSection } = getCurrentFormProgress(pathname);

  return (
    <>
      {sectionsIdsWithBanner.includes(currentSection.id) && (
        // headingLevel doesn't matter, see https://github.com/trussworks/react-uswds/issues/3244
        <Alert type="warning" headingLevel="h1">
          <>
            This tool is a work in progress and{" "}
            <strong>
              is intended exclusively for individual doulas operating as Sole Proprietors.
            </strong>{" "}
            If you don’t fall into this category, please use the standard{" "}
            <a
              href="https://www.njmmis.com/providerEnrollment.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="usa-link--external"
            >
              Medicaid Fee-for-Service application
            </a>
            . You are not eligible for this tool if you have an EIN or an LLC.
          </>
        </Alert>
      )}
    </>
  );
};

export default WipBanner;
