import LegalStep1 from "@/app/form/(formSteps)/legal/1/LegalStep1";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";

describe("<LegalStep1 />", () => {
  const oldProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
  });

  afterAll(() => {
    process.env = oldProcessEnv;
  });

  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<LegalStep1 />, "/form/legal/1", dataStore);

  it("renders", async () => {
    renderFunction();
  });
});
