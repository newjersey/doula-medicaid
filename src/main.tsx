import "@/app/globals.css";
import "@newjersey/njwds/dist/css/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
// import { GoogleAnalytics } from "@next/third-parties/google";
import App from "@/App.tsx";
import { BASE_PATH } from "@/app/basePath";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={BASE_PATH}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
