import winston from "winston";
import path from "path";
import fs from "fs";

// Membuat direktori log jika belum ada
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Konfigurasi Winston logger
const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "Data Sentry API" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  ],
});

// Tambahkan transport console jika bukan di production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
