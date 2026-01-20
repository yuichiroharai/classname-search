import { execa } from "execa";
import { describe, expect, it } from "vitest";

const CLI_PATH = "dist/cli.js";
const FIXTURE_PATH = "test/fixtures/extracting-class-names.txt";

describe("extracting class names", () => {
  it("should only match class attributes, not text content", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-base$",
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should support class and className attributes", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-xs$",
    ]);

    expect(stdout).toContain("Total: 2 matches");
  });

  it("should support double quotes and single quotes, but ignore braces", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-sm$",
    ]);

    expect(stdout).toContain("Total: 2 matches");
  });

  it("should extract only the first attribute per line", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-lg$",
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should ignore multi-line attributes", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-white$",
    ]);

    expect(stdout).toContain("Total: 0 matches");
  });

  it("should process comments", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^text-xl$",
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should handle escaped characters in attribute value", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "stats",
      FIXTURE_PATH,
      "^font-",
    ]);

    expect(stdout).toContain("Total: 1 match in");
  });

  it("should normalize whitespace", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "search",
      FIXTURE_PATH,
      "^m[trlb]-\\d$",
    ]);

    const lines = stdout.trim().split("\n");
    expect(lines).toHaveLength(4);
    expect(stdout).toContain('"classValue":"mt-1 mr-2 mb-3 ml-4"');
  });

  it("should use non-greedy match to avoid matching id attribute", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      "search",
      FIXTURE_PATH,
      "^text-2xl$",
    ]);

    const lines = stdout.trim().split("\n");
    expect(lines).toHaveLength(1);
    expect(stdout).toContain('"classValue":"text-2xl"');
  });
});
