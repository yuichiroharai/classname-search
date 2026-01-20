import { execa } from "execa";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SUB_COMMAND = "replace";
const CLI_PATH = "dist/cli.js";
const OUTPUT_DIR = "test/output-replace";

describe(`"${SUB_COMMAND}" command`, () => {
  beforeAll(async () => {
    const fs = await import("fs/promises");
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  });

  afterAll(async () => {
    const fs = await import("fs/promises");
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  });

  it("should replace '-neutral-' with '-slate-'", async () => {
    const targetFile = `${OUTPUT_DIR}/Replace-1.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile("test/fixtures/components/Replace.jsx", targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "-neutral-",
      "-slate-",
    ]);

    expect(stdout).toContain(
      'Replaced 3 matches of "-neutral-" with "-slate-"',
    );

    const content = await fs.readFile(targetFile, "utf-8");

    expect(content).toContain("text-slate-200");
    expect(content).toContain("text-slate-300");
    expect(content).toContain("text-slate-custom");
    expect(content).not.toContain("text-neutral-");
  });

  it("should support capture groups in replacement", async () => {
    const targetFile = `${OUTPUT_DIR}/Replace-2.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile("test/fixtures/components/Replace.jsx", targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "-neutral-(\\d+)$",
      "-slate-$1",
    ]);

    expect(stdout).toContain("Replaced 2 matches");

    const content = await fs.readFile(targetFile, "utf-8");

    expect(content).toContain("text-slate-200");
    expect(content).toContain("text-slate-300");
    expect(content).not.toMatch(/text-neutral-\d+/);
  });

  it("should preserve original quote style", async () => {
    const targetFile = `${OUTPUT_DIR}/extracting-class-names.txt`;
    const fs = await import("fs/promises");
    await fs.copyFile("test/fixtures/extracting-class-names.txt", targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^text-sm$",
      "text-[0.875rem]",
    ]);

    expect(stdout).toContain("Replaced 2 matches");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className="text-[0.875rem]"');
    expect(content).toContain("className='text-[0.875rem]'");
  });

  it("should expand single class to multiple classes", async () => {
    const targetFile = `${OUTPUT_DIR}/Replace-4.jsx`;
    const fs = await import("fs/promises");
    await fs.copyFile("test/fixtures/components/Replace.jsx", targetFile);

    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      targetFile,
      "--",
      "^mx-2$",
      "ml-2 mr-4",
    ]);

    expect(stdout).toContain("Replaced 1 match");

    const content = await fs.readFile(targetFile, "utf-8");
    expect(content).toContain('className="ml-2 mr-4 my-2 px-2 py-2"');
    expect(content).not.toContain("mx-2");
  });
});
