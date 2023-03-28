import fs from "fs";
import * as path from "path";

export const logAuth = (message: string) => {
  const now = new Date();
  const timestamp = now.toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  const logFilePath = path.join("src", "logs", "auth.log");

  if (fs.existsSync(logFilePath)) {
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error(`Ошибка при записи лога: ${err}`);
      }
    });
  } else {
    fs.writeFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error(`Ошибка при создании файла лога: ${err}`);
      }
    });
  }
};
