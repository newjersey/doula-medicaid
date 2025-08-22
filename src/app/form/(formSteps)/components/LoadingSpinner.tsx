"use client";
import loadingIcon from "public/loading.gif";

export const LoadingSpinner = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => {
  return loading ? (
    <div style={{ textAlign: "center" }} aria-live="polite">
      <img
        style={{ maxHeight: "20vh", opacity: 0.2 }}
        src={loadingIcon.src}
        alt="An image of a cartoon snail with a blue shell and yellow body bouncing up and down over a grayish-blue rectagle with rounded corners, kinda like it is riding a skateboard with no wheels"
      />
    </div>
  ) : (
    children
  );
};
