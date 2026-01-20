import { execa } from "execa";
import { describe, expect, it } from "vitest";

const SUB_COMMAND = "stats";
const CLI_PATH = "dist/cli.js";

describe("validation", () => {
  it("should throw an error when target-glob is empty", async () => {
    try {
      await execa("node", [CLI_PATH, SUB_COMMAND, "", "flex"]);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect((error as Error).message).toContain("target-glob cannot be empty");
    }
  });

  it("should throw an error when class-regex is empty", async () => {
    try {
      await execa("node", [CLI_PATH, SUB_COMMAND, "test/fixtures/**/*.jsx", ""]);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect((error as Error).message).toContain("class-regex cannot be empty");
    }
  });
});
