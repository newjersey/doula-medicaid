import { BASE_PATH } from "@/app/basePath";
import BusinessStep1 from "@/app/form/(formSteps)/business/1/BusinessStep1";
import BusinessStep2 from "@/app/form/(formSteps)/business/2/BusinessStep2";
import BusinessStep3 from "@/app/form/(formSteps)/business/3/BusinessStep3";
import BusinessStep4 from "@/app/form/(formSteps)/business/4/BusinessStep4";
import { FormLayout } from "@/app/form/(formSteps)/FormLayout";
import InsuranceStep1 from "@/app/form/(formSteps)/insurance/1/InsuranceStep1";
import InsuranceStep2 from "@/app/form/(formSteps)/insurance/2/InsuranceStep2";
import PersonalStep1 from "@/app/form/(formSteps)/personal/1/PersonalStep1";
import PersonalStep2 from "@/app/form/(formSteps)/personal/2/PersonalStep2";
import PersonalStep3 from "@/app/form/(formSteps)/personal/3/PersonalStep3";
import PersonalStep4 from "@/app/form/(formSteps)/personal/4/PersonalStep4";
import ReviewSection from "@/app/form/(formSteps)/review/ReviewSection";
import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/ScreeningStep1";
import ScreeningStep2 from "@/app/form/(formSteps)/screening/2/ScreeningStep2";
import ScreeningStep3 from "@/app/form/(formSteps)/screening/3/ScreeningStep3";
import TrainingStep1 from "@/app/form/(formSteps)/training/1/TrainingStep1";
import WebsiteUnavailable from "@/app/form/(formSteps)/welcome/WebsiteUnavailable";
import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import { BrowserRouter, Route, Routes } from "react-router";
import LegalStep1 from "./(formSteps)/legal/1/LegalStep1";
import LegalStep2 from "./(formSteps)/legal/2/LegalStep2";
import LegalStep3 from "./(formSteps)/legal/3/LegalStep3";

export const websiteUnavailableRoutes = (
  <Routes>
    {/* <Route path="form">
      <Route path="welcome" element={<WebsiteUnavailable />} />
    </Route> */}
    <Route path="*" element={<WebsiteUnavailable />} />
  </Routes>
);

export const routes = (
  <Routes>
    <Route path="form">
      <Route element={<FormLayout />}>
        <Route path="welcome" element={<WelcomeSection />} />
        <Route path="screening">
          <Route path="1" element={<ScreeningStep1 />} />
          <Route path="2" element={<ScreeningStep2 />} />
          <Route path="3" element={<ScreeningStep3 />} />
        </Route>
        <Route path="insurance">
          <Route path="1" element={<InsuranceStep1 />} />
          <Route path="2" element={<InsuranceStep2 />} />
        </Route>
        <Route path="training">
          <Route path="1" element={<TrainingStep1 />} />
        </Route>
        <Route path="personal">
          <Route path="1" element={<PersonalStep1 />} />
          <Route path="2" element={<PersonalStep2 />} />
          <Route path="3" element={<PersonalStep3 />} />
          <Route path="4" element={<PersonalStep4 />} />
        </Route>
        <Route path="business">
          <Route path="1" element={<BusinessStep1 />} />
          <Route path="2" element={<BusinessStep2 />} />
          <Route path="3" element={<BusinessStep3 />} />
          <Route path="4" element={<BusinessStep4 />} />
        </Route>
        <Route path="legal">
          <Route path="1" element={<LegalStep1 />} />
          <Route path="2" element={<LegalStep2 />} />
          <Route path="3" element={<LegalStep3 />} />
        </Route>
        <Route path="review" element={<ReviewSection />} />
      </Route>
    </Route>
  </Routes>
);

export default function ClientRoutes() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      {process.env.NEXT_PUBLIC_FLAG_WEBSITE_UNAVAILABLE === "1" ? websiteUnavailableRoutes : routes}
    </BrowserRouter>
  );
}
