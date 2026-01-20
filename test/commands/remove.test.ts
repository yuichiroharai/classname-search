import { execa } from "execa";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SUB_COMMAND = "remove";
const CLI_PATH = "dist/cli.js";
const OUTPUT_DIR = "test/output-remove";
const SOURCE_FILE = "test/fixtures/components/Remove.jsx";

describe(`"${SUB_COMMAND}" command`, () => {
  beforeAll(async () => {
    const fs = await import("fs/promises");
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  });

  afterAll(async () => {
    const fs = await import("fs/promises");
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  });

  it("should remove middle class and trim whitespace", async () => {
    const targetFile = `${OUTPUT_DIR}/Remove-1.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_FILE, targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^pr-2$",
    ]);

    expect(stdout).toContain("Removed 1 match");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className="pt-1 pb-3"');
    expect(content).not.toContain("pr-2");
  });

  it("should remove first class and trim whitespace", async () => {
    const targetFile = `${OUTPUT_DIR}/Remove-2.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_FILE, targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^pt-4$",
    ]);

    expect(stdout).toContain("Removed 1 match");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className="pr-5 pb-6"');
    expect(content).not.toContain("pt-4");
  });

  it("should remove last class and trim whitespace", async () => {
    const targetFile = `${OUTPUT_DIR}/Remove-3.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_FILE, targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^pb-9$",
    ]);

    expect(stdout).toContain("Removed 1 match");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className="pt-7 pr-8"');
    expect(content).not.toContain("pb-9");
  });

  it("should remove all classes when single class exists", async () => {
    const targetFile = `${OUTPUT_DIR}/Remove-4.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_FILE, targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^pt-0$",
    ]);

    expect(stdout).toContain("Removed 1 match");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className=""');
    expect(content).not.toContain("pt-0");
  });

  it("should remove all classes when multiple matches", async () => {
    const targetFile = `${OUTPUT_DIR}/Remove-5.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_FILE, targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^p[trbl]-10$",
    ]);

    expect(stdout).toContain("Removed 4 matches");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className=""');
    expect(content).not.toContain("-10");
  });
});
