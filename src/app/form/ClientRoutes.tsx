import { BASE_PATH } from "@/app/basePath";
import BusinessDetailsStep1 from "@/app/form/(formSteps)/business-details/1/BusinessDetailsStep1";
import BusinessDetailsStep2 from "@/app/form/(formSteps)/business-details/2/BusinessDetailsStep2";
import BusinessDetailsStep3 from "@/app/form/(formSteps)/business-details/3/BusinessDetailsStep3";
import FinishSection from "@/app/form/(formSteps)/finish/FinishSection";
import { FormLayout } from "@/app/form/(formSteps)/FormLayout";
import InsuranceStep1 from "@/app/form/(formSteps)/insurance/1/InsuranceStep1";
import InsuranceStep2 from "@/app/form/(formSteps)/insurance/2/InsuranceStep2";
import PersonalDetailsStep1 from "@/app/form/(formSteps)/personal-details/1/PersonalDetailsStep1";
import PersonalDetailsStep2 from "@/app/form/(formSteps)/personal-details/2/PersonalDetailsStep2";
import PersonalDetailsStep3 from "@/app/form/(formSteps)/personal-details/3/PersonalDetailsStep3";
import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/ScreeningStep1";
import ScreeningStep2 from "@/app/form/(formSteps)/screening/2/ScreeningStep2";
import ScreeningStep3 from "@/app/form/(formSteps)/screening/3/ScreeningStep3";
import TrainingStep1 from "@/app/form/(formSteps)/training/1/TrainingStep1";
import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import { BrowserRouter, Route, Routes } from "react-router";
import LegalStep1 from "./(formSteps)/legal/1/LegalStep1";
import LegalStep2 from "./(formSteps)/legal/2/LegalStep2";
import LegalStep3 from "./(formSteps)/legal/3/LegalStep3";

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
        <Route path="personal-details">
          <Route path="1" element={<PersonalDetailsStep1 />} />
          <Route path="2" element={<PersonalDetailsStep2 />} />
          <Route path="3" element={<PersonalDetailsStep3 />} />
        </Route>
        <Route path="business-details">
          <Route path="1" element={<BusinessDetailsStep1 />} />
          <Route path="2" element={<BusinessDetailsStep2 />} />
          <Route path="3" element={<BusinessDetailsStep3 />} />
        </Route>
        {process.env.NEXT_PUBLIC_FLAG_LEGAL === "1" ? (
          <Route path="legal">
            <Route path="1" element={<LegalStep1 />} />
            <Route path="2" element={<LegalStep2 />} />
            <Route path="3" element={<LegalStep3 />} />
          </Route>
        ) : null}
        <Route path="finish" element={<FinishSection />} />
      </Route>
    </Route>
  </Routes>
);

export default function ClientRoutes() {
  return <BrowserRouter basename={BASE_PATH}>{routes}</BrowserRouter>;
}
