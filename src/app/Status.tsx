import { formatTitle } from "@/app/_utils/title";

export const Status = () => {
  return (
    <div>
      <title>{formatTitle("Status")}</title>
      {JSON.stringify({
        featureFlags: {
          VITE_FLAG_TEST: import.meta.env.VITE_FLAG_TEST,
          VITE_FLAG_WEBSITE_UNAVAILABLE: import.meta.env.VITE_FLAG_WEBSITE_UNAVAILABLE,
        },
      })}
    </div>
  );
};
