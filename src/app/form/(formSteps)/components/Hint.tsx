import { formatHintId } from "@/app/form/(formSteps)/components/utils/doulaInput";

export const Hint = (props: { name: string; hint: string }) => {
  return (
    <div id={formatHintId(props.name)} className="usa-hint">
      {props.hint}
    </div>
  );
};
