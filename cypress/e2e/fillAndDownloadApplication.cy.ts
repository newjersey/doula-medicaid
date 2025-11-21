import { fillAndDownloadApplication, formPages } from "./fillAndDownloadApplication";

it("should fill and download the application", () => {
  const flagOnAdd = [
    ...formPages,
    { url: "/form/legal/1", fields: [], titleName: "Legal 1 of 3" },
    { url: "/form/legal/2", fields: [], titleName: "Legal 2 of 3" },
    { url: "/form/legal/3", fields: [], titleName: "Legal 3 of 3" },
  ];

  fillAndDownloadApplication(flagOnAdd);
});
