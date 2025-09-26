import BusinessDetails1 from "@/app/form/(formSteps)/business-details/1/BusinessDetails1";
import BusinessDetails2 from "@/app/form/(formSteps)/business-details/2/BusinessDetails2";
import BusinessDetails3 from "@/app/form/(formSteps)/business-details/3/BusinessDetails3";
import BusinessDetails4 from "@/app/form/(formSteps)/business-details/4/BusinessDetails4";
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
import { BrowserRouter, Route, Routes } from "react-router";

export const routes = (
  <Routes>
    <Route path="form">
      <Route element={<FormLayout />}>
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
          <Route path="1" element={<BusinessDetails1 />} />
          <Route path="2" element={<BusinessDetails2 />} />
          <Route path="3" element={<BusinessDetails3 />} />
          <Route path="4" element={<BusinessDetails4 />} />
        </Route>
        <Route path="finish" element={<FinishSection />} />
      </Route>
    </Route>
  </Routes>
);

export default function ClientRoutes() {
  return <BrowserRouter>{routes}</BrowserRouter>;
}
