import { createLogger, format, transports } from "winston";

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    isProduction ? format.json() : format.simple(),
  ),
  transports: [new transports.Console()],
});

// file logs ONLY if you really need them
if (!isProduction) {
  logger.add(
    new transports.File({ filename: "logs/error.log", level: "error" }),
  );
  logger.add(new transports.File({ filename: "logs/app.log" }));
}

export default logger;
