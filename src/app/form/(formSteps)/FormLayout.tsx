import { formatTitle } from "@/app/_utils/title";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DataStoreProvider } from "@/app/form/_utils/DataStoreProvider";
import { ProgressBar } from "@/app/form/components/ProgressBar";
import { getCurrentFormProgress } from "@form/_utils/formProgress";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Outlet } from "react-router";

export const FormLayout = () => {
  const pathname = usePathname();
  const { section: currentSection, step: currentStep } = getCurrentFormProgress(pathname);
  let pageTitle = currentSection.name;
  if (currentStep !== undefined) {
    pageTitle += ` ${currentStep} of ${currentSection.numSteps}`;
  }

  // Handle React Router not loading pages at the top https://github.com/newjersey/doula-medicaid/pull/265
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <DataStoreProvider>
        <title>{formatTitle(pageTitle)}</title>
        {currentSection.shouldShowProgressBar === true && (
          <>
            <ProgressBar />
            <HorizontalDivider />
          </>
        )}
        <Outlet />
      </DataStoreProvider>
    </>
  );
};
