import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, json } = format;
import "winston-daily-rotate-file";
import morgan from "morgan";

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json() // ใน Production ควรเก็บเป็น JSON เพื่อให้ Tools อื่นอ่านง่าย
  ),
  transports: [
    // 1. Console Log (แสดงเฉพาะตอนไม่ได้อยู่ Production)
    new transports.Console({
      format: combine(colorize(), logFormat),
      level: "debug", // แสดง log ระดับ debug ขึ้นไป
    }),

    // 2. บันทึกไฟล์ Error แยกต่างหาก (เก็บ 14 วัน)
    new transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d",
    }),

    // 3. บันทึกทุกอย่างรวมกัน (เก็บ 30 วัน)
    new transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
    }),
  ],
});

// HTTP Logger middleware using morgan
logger.httpLogger = (formatString, options) => {
  return morgan(formatString, {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
    ...options,
  });
};

export default logger;
