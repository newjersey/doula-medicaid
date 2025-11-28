import { baseFormPages, fillAndDownloadApplication } from "./fillAndDownloadApplication";

/*
reusable function call from fillAndDownloadApplication.ts , where we take baseFormPages array, add the conditional
*/
it("should fill and download the application", () => {
  const baseFormAdd = [
    ...baseFormPages,
    { url: "/form/legal/1", fields: [], titleName: "Legal 1 of 3" },
    { url: "/form/legal/2", fields: [], titleName: "Legal 2 of 3" },
    { url: "/form/legal/3", fields: [], titleName: "Legal 3 of 3" },
  ];

  fillAndDownloadApplication(baseFormAdd);
});
