import { BASE_PATH } from "@/app/basePath";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import ClientRoutes from "@/app/form/ClientRoutes";
import "@/app/globals.css";
import "@newjersey/njwds/dist/css/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={BASE_PATH}>
        <ClientRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
