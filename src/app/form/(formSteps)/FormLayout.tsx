import { allSections, getCurrentFormProgress } from "@form/_utils/formProgress";
import { RequiredMarker } from "@trussworks/react-uswds";

type CompletionState = "complete" | "current" | "incomplete";

// Separated this into a separate testable component because as of writing, Jest does not support testing NextJs asynchronous server components (https://nextjs.org/docs/app/guides/testing/jest)
export const FormLayout = (props: { children?: React.ReactNode; pathname: string }) => {
  const { section: currentSection } = getCurrentFormProgress(props.pathname);
  const currentSectionIndex = allSections.findIndex(
    (sections) => sections.id === currentSection.id,
  );

  return (
    <>
      <div className="usa-step-indicator" aria-label="progress">
        <div className="usa-step-indicator__segments">
          {allSections.map((sections, sectionIndex) => {
            let completionState: CompletionState;
            switch (true) {
              case sectionIndex < currentSectionIndex:
                completionState = "complete";
                break;
              case sectionIndex === currentSectionIndex:
                completionState = "current";
                break;
              case sectionIndex > currentSectionIndex:
                completionState = "incomplete";
                break;
              default:
                throw new Error(`Unexpected logic path: ${sectionIndex}, ${currentSectionIndex}`);
                break;
            }

            const liSegmentClassSuffix = {
              complete: "complete",
              current: "current",
              incomplete: null,
            }[completionState];

            return (
              <li
                key={sections.id}
                className={`usa-step-indicator__segment ${liSegmentClassSuffix ? `usa-step-indicator__segment--${liSegmentClassSuffix}` : ""}`}
                tabIndex={sectionIndex}
              >
                <span className="usa-step-indicator__segment-label">
                  {sections.progressBarTitle}
                </span>
              </li>
            );
          })}
        </div>
      </div>

      <div className="display-flex flex-justify">
        <h1 className="font-heading-lg">{currentSection.heading}</h1>
        <div className="text-right">
          {" "}
          A red asterisk (<RequiredMarker />) indicates a required field.
        </div>
      </div>
      <hr className="width-full" />
      <div className="margin-top-5 margin-bottom-5">{props.children}</div>
    </>
  );
};
