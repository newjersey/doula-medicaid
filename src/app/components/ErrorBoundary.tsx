import { formatTitle } from "@/app/_utils/title";
import * as React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    gtag("event", "uncaughtError", {
      error: `${error.message} - ${error.stack}`,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center" }}>
          <title>{formatTitle("Sorry, something went wrong")}</title>
          <h1>Sorry, something went wrong</h1>
          <p className="maxw-full">
            Please contact the Doula Guides team at{" "}
            <a href="mailto:mahs.doulaguide@dhs.nj.gov" target="_blank" rel="noopener">
              mahs.doulaguide@dhs.nj.gov
            </a>
            .
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
