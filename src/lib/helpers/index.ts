export const getEnvironmentVar = (key: ENVIRONMENT): string => {
  const variable = import.meta.env[key];
  if (variable === undefined) {
    throw new Error(`Environment variable ${key} is not defined.`);
  }
  return variable;
};
