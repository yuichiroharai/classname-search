import { execa } from "execa";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const CLI_PATH = "dist/cli.js";
const OUTSIDE_CWD_DIR = "../test-outside-cwd";
const isCI = process.env.CI === "true";

describe.skipIf(isCI)("CWD filtering", () => {
  beforeAll(async () => {
    const fs = await import("fs/promises");
    await fs.mkdir(OUTSIDE_CWD_DIR, { recursive: true });
    await fs.writeFile(
      `${OUTSIDE_CWD_DIR}/Outside.jsx`,
      '<div className="flex"></div>',
    );
  });

  afterAll(async () => {
    const fs = await import("fs/promises");
    await fs.rm(OUTSIDE_CWD_DIR, { recursive: true, force: true });
  });

  it("should exclude files outside CWD", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      `${OUTSIDE_CWD_DIR}/*.jsx`,
      "flex",
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });
});
