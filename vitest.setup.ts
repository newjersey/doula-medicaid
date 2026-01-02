import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

beforeEach(() => {
  vi.stubGlobal("gtag", vi.fn());
});
