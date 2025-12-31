export const Status = () => {
  return (
    <div>
      {JSON.stringify({
        featureFlags: {
          NEXT_PUBLIC_FLAG_TEST: import.meta.env.NEXT_PUBLIC_FLAG_TEST,
          NEXT_PUBLIC_FLAG_WEBSITE_UNAVAILABLE: import.meta.env
            .NEXT_PUBLIC_FLAG_WEBSITE_UNAVAILABLE,
        },
      })}
    </div>
  );
};
