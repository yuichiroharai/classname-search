import { execa } from "execa";
import { describe, expect, it } from "vitest";

const CLI_PATH = "dist/cli.js";
const FIXTURE_PATH = "test/fixtures/empty-class-names.txt";

describe("empty class names", () => {
  it("should ignore empty class attribute", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      ".",
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });

  it("should ignore whitespace-only class attribute", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "\\s",
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });
});
