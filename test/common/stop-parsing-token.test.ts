import { execa } from "execa";
import { describe, expect, it } from "vitest";

const SUB_COMMAND = "stats";
const CLI_PATH = "dist/cli.js";
const FIXTURE_PATH = "test/fixtures/components/Component.jsx";
const REGEX_PATTERN = "^flex$";

describe("stop-parsing token (PowerShell --%)", () => {
  it("should strip double quotes from glob pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      `"${FIXTURE_PATH}"`,
      REGEX_PATTERN,
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should strip double quotes from regex pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      `"${REGEX_PATTERN}"`,
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should strip single quotes from regex pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      `'${REGEX_PATTERN}'`,
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should not strip quote at start only from regex pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      `"${REGEX_PATTERN}`,
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });

  it("should not strip quote at end only from regex pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      `${REGEX_PATTERN}"`,
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });
});
