import { Command } from "commander";
import { removeQuotes } from "../utils/args.js";
import { getTargetFiles } from "./files.js";

export const addCommonArgs = (command: Command): Command => {
  return command
    .argument(
      "<target-glob>",
      "Glob pattern for target files (fast-glob syntax)",
    )
    .argument("<class-regex>", "Regex pattern to match classes")
    .option(
      "--force",
      "Allow processing files outside the current working directory. Do not use unless explicitly permitted by the user.",
    )
    .option(
      "--ignore <pattern...>",
      "Glob patterns to ignore.",
      ["**/node_modules/**"], // Default ignore pattern
    );
};

export const prepareContext = async (
  targetGlob: string,
  classRegex: string,
  options: { force?: boolean; ignore?: string[] },
) => {
  // Strip quotes preserved by PowerShell when using --%.
  const cleanGlob = removeQuotes(targetGlob);
  const cleanRegex = removeQuotes(classRegex);

  if (!cleanGlob) {
    throw new Error("target-glob cannot be empty");
  }
  if (!cleanRegex) {
    throw new Error("class-regex cannot be empty");
  }

  const filteredFiles = await getTargetFiles(cleanGlob, options);
  const regex = new RegExp(cleanRegex);

  return { filteredFiles, regex };
};
