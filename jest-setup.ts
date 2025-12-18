import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

beforeEach(() => {
  sessionStorage.clear();
});

// For React Router
// https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
Object.assign(global, { TextDecoder, TextEncoder });

// To remove warnings that GA has not been initialized when components call sendGAEvent
jest.mock("@next/third-parties/google", () => ({
  ...jest.requireActual("@next/third-parties/google"),
  sendGAEvent: jest.fn(),
}));
