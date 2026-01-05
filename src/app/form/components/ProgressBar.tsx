import { getCurrentFormProgress, getProgressBarSections } from "@form/_utils/formProgress";
import { RequiredMarker } from "@trussworks/react-uswds";
import { useLocation } from "react-router";

type CompletionState = "complete" | "current" | "incomplete";

export const ProgressBar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { section: currentSection, step: currentStep } = getCurrentFormProgress(pathname);
  const currentSectionIndex = getProgressBarSections().findIndex(
    (sections) => sections.id === currentSection.id,
  );

  return (
    <div className="usa-step-indicator" aria-label="progress">
      <ol className="usa-step-indicator__segments">
        {getProgressBarSections().map((section, sectionIndex) => {
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
              key={section.id}
              className={`usa-step-indicator__segment ${liSegmentClassSuffix ? `usa-step-indicator__segment--${liSegmentClassSuffix}` : ""}`}
              {...(completionState === "current" && { "aria-current": "true" })}
            >
              <span className="usa-step-indicator__segment-label">
                {section.name}
                {screenreaderStatus && <span className="usa-sr-only">{screenreaderStatus}</span>}
              </span>
            </li>
          );
        })}
      </ol>

      {currentSection.shouldShowProgressHeadingAndRequiredMessage === true && (
        <div className="usa-step-indicator__header display-flex flex-justify">
          <h1 className="font-heading-lg">
            {currentStep !== undefined && (
              <span className="usa-step-indicator__heading-counter">
                <span className="usa-sr-only" data-testid="step-text">
                  Step
                </span>
                <span className="usa-step-indicator__current-step">{currentStep}</span>
                &nbsp;
                <span className="usa-step-indicator__total-steps">{`of ${currentSection.numSteps}`}</span>
                &nbsp;
              </span>
            )}
            <span className="usa-step-indicator__heading-text">{currentSection.name}</span>
          </h1>
          <div className="text-right">
            A red asterisk (<RequiredMarker />) indicates a required field.
          </div>
        </div>
      )}
    </div>
  );
};
