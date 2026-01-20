import { execa } from "execa";
import { describe, expect, it } from "vitest";

const SUB_COMMAND = "stats";
const CLI_PATH = "dist/cli.js";
const FIXTURE_PATH = "test/fixtures/components/Component.jsx";

describe("regex pattern", () => {
  it("should match partial class names with 'flex'", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "flex",
    ]);

    expect(stdout).toContain("Total: 3 matches");
  });

  it("should match exact class name with '^flex$'", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "^flex$",
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should match pattern with capture group 'text-neutral-(\\d+)$'", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      FIXTURE_PATH,
      "text-neutral-(\\d+)$",
    ]);

    expect(stdout).toContain("Total: 3 matches");
  });
});
