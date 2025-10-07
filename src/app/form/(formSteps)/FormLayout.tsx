import { formatTitle } from "@/app/_utils/title";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DataStoreProvider } from "@/app/form/_utils/DataStoreProvider";
import { ProgressBar } from "@/app/form/components/ProgressBar";
import { getCurrentFormProgress } from "@form/_utils/formProgress";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Outlet } from "react-router";

export const FormLayout = () => {
  const pathname = usePathname();
  const { section: currentSection, step: currentStep } = getCurrentFormProgress(pathname);
  const [count, setCount] = useState<number>(0);
  let pageTitle = currentSection.name;
  if (currentStep !== undefined) {
    pageTitle += ` ${currentStep} of ${currentSection.numSteps}`;
  }

  return (
    <>
      <DataStoreProvider>
        <title>{formatTitle(pageTitle)}</title>
        {currentSection.shouldHideProgressBar !== true && <ProgressBar />}
        <HorizontalDivider />
        <div>
          <div>Count: {count}</div>
          <div>
            <button onClick={() => setCount(count + 1)}>add</button>
            <button onClick={() => setCount(count - 1)}>subtract</button>
          </div>
        </div>
        <Outlet />
      </DataStoreProvider>
    </>
  );
};
