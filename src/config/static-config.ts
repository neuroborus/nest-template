import 'dotenv/config';

const DEFAULT_PORT = 3000;
const rawPort = process.env.PORT;
const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : Number.NaN;
const port =
  Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : DEFAULT_PORT;

const rawLogLevel = process.env.LOG_LEVEL?.trim();
const logLevel = rawLogLevel ? rawLogLevel.toLowerCase() : 'info';

/*
 This configuration is used directly only when dependency injection is not working,
 e.g. during application startup and its setup.
 Also, it fulfills dynamic (dependency-injection-based, main) configuration.
 */
export const staticConfig = {
  port,
  logLevel,
};
