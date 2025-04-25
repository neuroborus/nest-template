export const missEnvError = (envName: string) =>
  new Error(`Missing env: ${envName}`);
