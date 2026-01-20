import { execa } from "execa";
import { describe, expect, it } from "vitest";

const CLI_PATH = "dist/cli.js";
const SUB_COMMAND = "stats";
const FIXTURE_PATH = "test/fixtures/components/*.jsx";

describe(`"${SUB_COMMAND}" command`, () => {
  it("should show only files with matches", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "flex",
    ]);

    expect(stdout).toContain("Component.jsx:");
    expect(stdout).toContain("Flex.jsx:");
    expect(stdout).not.toContain("Grid.jsx: 0 matches");
    expect(stdout).not.toContain("Remove.jsx: 0 matches");
    expect(stdout).not.toContain("Replace.jsx: 0 matches");
    expect(stdout).toContain("in 2 files");
    expect(stdout).not.toContain("in 5 files");
  });

  it("should show all files with --verbose", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "flex",
      "--verbose",
    ]);

    expect(stdout).toContain("Component.jsx:");
    expect(stdout).toContain("Flex.jsx:");
    expect(stdout).toContain("Grid.jsx: 0 matches");
    expect(stdout).toContain("Remove.jsx: 0 matches");
    expect(stdout).toContain("Replace.jsx: 0 matches");
    expect(stdout).not.toContain("in 2 files");
    expect(stdout).toContain("in 5 files");
  });

  it("should count matches correctly per file and in total", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "flex",
    ]);

    expect(stdout).toContain("Component.jsx: 3 matches");
    expect(stdout).toContain("Flex.jsx: 1 match");
    expect(stdout).toContain("Total: 4 matches in 2 files");
  });

  it("should use correct singular forms", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "grid",
    ]);

    expect(stdout).not.toContain("Grid.jsx: 1 matches");
    expect(stdout).toContain("Grid.jsx: 1 match");
    expect(stdout).not.toContain("in 1 files");
    expect(stdout).toContain("in 1 file");
  });

  it("should use correct plural forms", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "flex",
    ]);

    expect(stdout).toContain("Component.jsx: 3 matches");
    expect(stdout).toContain("in 2 files");
  });
});
