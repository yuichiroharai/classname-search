import { execa } from "execa";
import { describe, expect, it } from "vitest";

const SUB_COMMAND = "stats";
const CLI_PATH = "dist/cli.js";

describe("glob pattern", () => {
  it("should only search within files matching the glob pattern", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      SUB_COMMAND,
      "test/fixtures/**/*.jsx",
      "flex",
    ]);

    expect(stdout).toContain(".jsx:");
    expect(stdout).not.toContain(".txt:");
  });
});
