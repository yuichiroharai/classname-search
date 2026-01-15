import * as fs from "fs";
import path from "path";

export const writeJsonl = <T>(filePath: string, items: T[]): void => {
  const content = items.map((item) => JSON.stringify(item)).join("\n");

  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, "utf-8");
};
