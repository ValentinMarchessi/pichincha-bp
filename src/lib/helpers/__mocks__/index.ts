const MOCK_ENVIRONMENT = {
  VITE_API_URL: "https://api.betterplace.org",
  VITE_AUTHOR_ID: "1",
};

export const getEnvironmentVar = (key: ENVIRONMENT): string =>
  MOCK_ENVIRONMENT[key] ?? "NOT_FOUND";
