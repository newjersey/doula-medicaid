"use client";

import { getCurrentFormProgress } from "@/app/form/_utils/formProgress";
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
        <div className="usa-alert usa-alert--warning" id="wipBanner">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              This site is in beta and may not cover every doula&apos;s unique situation.
            </p>
            <p className="usa-alert__text">
              If you are not covered by this tool, please use the standard{" "}
              <a
                href="https://www.njmmis.com/providerEnrollment.aspx"
                target="_blank"
                rel="noopener"
              >
                Medicaid Fee-for-Service application
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WipBanner;
