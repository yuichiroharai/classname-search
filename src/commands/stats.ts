import { Command } from "commander";
import { readFile } from "node:fs/promises";
import { addCommonArgs, prepareContext } from "../common/commands.js";

import { extractClassNames } from "../common/class-names.js";

export const statsCommand = addCommonArgs(new Command("stats"))
  .description("Count matched class names per file")
  .option(
    "-v, --verbose",
    "Show detailed output including files with no matches",
  )
  .action(async (targetGlob: string, classRegex: string, options) => {
    const { filteredFiles, regex } = await prepareContext(
      targetGlob,
      classRegex,
      options,
    );

    let totalMatches = 0;
    let printedFilesCount = 0;

    for (const file of filteredFiles) {
      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");

      let fileMatches = 0;

      for (const line of lines) {
        const extracted = extractClassNames(line);

        if (!extracted) {
          continue;
        }

        const { classNames } = extracted;

        for (const className of classNames) {
          if (regex.test(className)) {
            fileMatches++;
          }
        }
      }

      if (fileMatches > 0 || options.verbose) {
        const unit = fileMatches === 1 ? "match" : "matches";
        console.log(`${file}: ${fileMatches} ${unit}`);
        totalMatches += fileMatches;
        printedFilesCount++;
      }
    }

    const totalUnit = totalMatches === 1 ? "match" : "matches";
    const fileUnit = printedFilesCount === 1 ? "file" : "files";
    console.log(
      `\nTotal: ${totalMatches} ${totalUnit} in ${printedFilesCount} ${fileUnit}`,
    );
  });
