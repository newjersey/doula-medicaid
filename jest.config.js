module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@form/(.*)$": "<rootDir>/src/app/form/$1",
    "^.+\\.(sass|css)$": "<rootDir>/src/app/__mocks__/styleMock.js",
    // it doesn't seem to be matching at all. whether it's a ts or js. it feels like if the problem was that the file was not found that that would be a different error
  },
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts", "jest-expect-message"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};
