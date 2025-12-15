import { path1TestFields as legalPath2TestFields } from "@/app/form/(formSteps)/legal/1/testFields";
import { baseFormPages, fillAndDownloadApplication } from "./fillAndDownloadApplication";

/*
Reusable function call from fillAndDownloadApplication.ts 
below we add the conditional array elements which will display whether the flag is raised or not 
*/
it("should fill and download the application", () => {
  const baseFormAdd = [
    ...baseFormPages,
    { url: "/form/legal/1", fields: legalPath2TestFields, titleName: "Legal 1 of 3" },
    { url: "/form/legal/2", fields: [], titleName: "Legal 2 of 3" },
    { url: "/form/legal/3", fields: [], titleName: "Legal 3 of 3" },
  ];

  fillAndDownloadApplication(baseFormAdd);
});
