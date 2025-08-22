import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

beforeEach(() => {
  sessionStorage.clear();
});
