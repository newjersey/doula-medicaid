import { formatTitle } from "@/app/_utils/title";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DataStoreProvider } from "@/app/form/_utils/DataStoreProvider";
import { ProgressBar } from "@/app/form/components/ProgressBar";
import { getCurrentFormProgress } from "@form/_utils/formProgress";
import { usePathname } from "next/navigation";
import { Outlet } from "react-router";

export const FormLayout = () => {
  const pathname = usePathname();
  const { section: currentSection, step: currentStep } = getCurrentFormProgress(pathname);
  let pageTitle = currentSection.name;
  if (currentStep !== undefined) {
    pageTitle += ` ${currentStep} of ${currentSection.numSteps}`;
  }

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
