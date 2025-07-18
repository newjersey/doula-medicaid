import { RequiredMarker } from "@trussworks/react-uswds";
import { allSections, getCurrentStep } from "../_utils/sections";

type CompletionState = "complete" | "current" | "incomplete";

// Separated this into a separate testable component because as of writing, Jest does not support testing NextJs asynchronous server components (https://nextjs.org/docs/app/guides/testing/jest)
export const FormLayout = (props: { children?: React.ReactNode; pathname: string }) => {
  const { section: currentSection, stepNum: currentStepNum } = getCurrentStep(props.pathname);
  const currentSectionIndex = allSections.findIndex(
    (sections) => sections.id === currentSection.id,
  );

  return (
    <>
      <div className="usa-step-indicator" aria-label="progress">
        <ol className="usa-step-indicator__segments">
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
            const screenreaderStatus = {
              complete: "completed",
              current: null,
              incomplete: "not completed",
            }[completionState];

            return (
              <li
                key={sections.id}
                className={`usa-step-indicator__segment ${liSegmentClassSuffix ? `usa-step-indicator__segment--${liSegmentClassSuffix}` : ""}`}
                {...(completionState === "current" && { "aria-current": "true" })}
              >
                <span className="usa-step-indicator__segment-label">
                  {sections.sectionName}
                  {screenreaderStatus && <span className="usa-sr-only">{screenreaderStatus}</span>}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="usa-step-indicator__header display-flex flex-justify">
          <h1 className="font-heading-lg">
            {currentStepNum !== null && (
              <span className="usa-step-indicator__heading-counter">
                <span className="usa-sr-only" data-testid="step-text">
                  Step
                </span>
                <span className="usa-step-indicator__current-step">{currentStepNum}</span>
                &nbsp;
                <span className="usa-step-indicator__total-steps">{`of ${currentSection.numSteps}`}</span>
                &nbsp;
              </span>
            )}
            <span className="usa-step-indicator__heading-text">{currentSection.heading}</span>
          </h1>
          <div className="text-right">
            {" "}
            A red asterisk (<RequiredMarker />) indicates a required field.
          </div>
        </div>
      </div>
      <div className="margin-top-4">{props.children}</div>
    </>
  );
};
