import { execa } from "execa";
import { afterAll, describe, expect, it } from "vitest";
import { escapeCaret, needsCaretEscape } from "../utils/caret-escape";

const CLI_PATH = "dist/cli.js";
const SUB_COMMAND = "search";
const OUTPUT_DIR = "test/output-search";

const NEEDS_CARET_ESCAPE = await needsCaretEscape();

describe(`"${SUB_COMMAND}" command`, () => {
  afterAll(async () => {
    const fs = await import("fs/promises");
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  });

  it("should not include stats summary unlike stats command", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/*.jsx",
      "flex",
    ]);

    expect(stdout).not.toContain("Component.jsx:");
    expect(stdout).not.toContain("Flex.jsx:");
    expect(stdout).not.toContain("Total:");
  });

  it("should output results from multiple files with correct line numbers", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/*.jsx",
      "flex",
    ]);

    expect(stdout).toContain(
      '"file":"test/fixtures/components/Component.jsx","line":3',
    );
    expect(stdout).toContain(
      '"file":"test/fixtures/components/Flex.jsx","line":3',
    );
  });

  it("should output separate results for each matched class in the same attribute", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/Component.jsx",
      "flex",
    ]);

    expect(stdout).toContain(
      '"line":3,"matched":"flex","className":"flex","classValue":"flex flex-col"',
    );
    expect(stdout).toContain(
      '"line":3,"matched":"flex","className":"flex-col","classValue":"flex flex-col"',
    );
  });

  it("should match class names by exact match", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/Component.jsx",
      escapeCaret("^flex$", NEEDS_CARET_ESCAPE),
    ]);

    expect(stdout).toContain('"matched":"flex","className":"flex"');
    expect(stdout).not.toContain('"className":"flex-col"');
    expect(stdout).not.toContain('"className":"inline-flex"');
  });

  it("should match class names by partial match", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/Component.jsx",
      "flex",
    ]);

    expect(stdout).toContain('"matched":"flex","className":"flex"');
    expect(stdout).toContain('"matched":"flex","className":"flex-col"');
    expect(stdout).toContain('"matched":"flex","className":"inline-flex"');
  });

  it("should support complex regex patterns", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "--",
      "test/fixtures/components/Component.jsx",
      "-neutral-\\d+$",
    ]);

    expect(stdout).toContain(
      '"matched":"-neutral-200","className":"text-neutral-200"',
    );
    expect(stdout).toContain(
      '"matched":"-neutral-300","className":"text-neutral-300"',
    );
    expect(stdout).toContain(
      '"matched":"-neutral-400","className":"text-neutral-400"',
    );
  });

  it("should write results to a file with --output", async () => {
    const outputPath = `${OUTPUT_DIR}/search-result.jsonl`;
    const args = [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/Component.jsx",
      "flex",
    ];

    const { stdout } = await execa("node", args);
    await execa("node", [...args, "--output", outputPath]);

    const fs = await import("fs/promises");
    const fileContent = await fs.readFile(outputPath, "utf-8");

    expect(fileContent.trim()).toBe(stdout.trim());
  });

  it("should use singular form in --output summary", async () => {
    const outputPath = `${OUTPUT_DIR}/search-result-singular.jsonl`;
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/components/Component.jsx",
      escapeCaret("^flex$", NEEDS_CARET_ESCAPE),
      "--output",
      outputPath,
    ]);

    expect(stdout).toContain("Saved 1 match in 1 file (searched 1 file)");
  });

  it("should use plural form in --output summary", async () => {
    const outputPath = `${OUTPUT_DIR}/search-result-plural.jsonl`;
    const globPattern = "test/fixtures/components/*.jsx";
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      globPattern,
      "flex",
      "--output",
      outputPath,
    ]);

    const fs = await import("fs/promises");
    const fileContent = await fs.readFile(outputPath, "utf-8");
    const lines = fileContent.trim().split("\n");
    const matchCount = lines.length;
    const matchedFileCount = new Set(lines.map((line) => JSON.parse(line).file))
      .size;

    const fg = await import("fast-glob");
    const searchedFileCount = (await fg.default(globPattern)).length;

    expect(stdout).toContain(
      `Saved ${matchCount} matches in ${matchedFileCount} files (searched ${searchedFileCount} files)`,
    );
  });
});
