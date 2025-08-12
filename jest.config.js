module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.+\\.(sass|css|png)$": "<rootDir>/src/app/__mocks__/moduleMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@form/(.*)$": "<rootDir>/src/app/form/$1",
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
