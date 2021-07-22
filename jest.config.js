module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  coverageDirectory: "reports/coverage",
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        "pageTitle": "Unit Test Report",
        "outputPath": "reports/jest.html"
      }
    ]
  ]

};
