import { Command } from "commander";
import { readFile } from "node:fs/promises";
import * as path from "path";
import { addCommonArgs, prepareContext } from "../common/commands.js";
import { removeQuotes } from "../utils/args.js";
import { writeJsonl } from "../utils/jsonl.js";

import { extractClassNames } from "../common/class-names.js";
import { MatchItem } from "../common/types.js";

export const searchCommand = addCommonArgs(new Command("search"))
  .description("Search for class names")
  .option("-o, --output <file>", "Output results to a JSONLines file")
  .action(async (targetGlob: string, classRegex: string, options) => {
    // Strip quotes preserved by PowerShell when using --%.
    options.output &&= removeQuotes(options.output);

    const { filteredFiles, regex } = await prepareContext(
      targetGlob,
      classRegex,
      options,
    );

    const results: MatchItem[] = [];

    for (const file of filteredFiles) {
      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const extracted = extractClassNames(line);

        if (!extracted) {
          continue;
        }

        const { classNames, classValue } = extracted;

        for (const className of classNames) {
          const match = className.match(regex);
          if (match) {
            results.push({
              file,
              line: lineIndex + 1,
              matched: match[0],
              className,
              classValue,
            });
          }
        }
      }
    }

    if (options.output) {
      const outputPath = path.resolve(process.cwd(), options.output);
      writeJsonl(outputPath, results);
      const matchedFileCount = new Set(results.map((r) => r.file)).size;
      const matchUnit = results.length === 1 ? "match" : "matches";
      const matchedFileUnit = matchedFileCount === 1 ? "file" : "files";
      const searchedFileUnit = filteredFiles.length === 1 ? "file" : "files";
      console.log(
        `Saved ${results.length} ${matchUnit} in ${matchedFileCount} ${matchedFileUnit} (searched ${filteredFiles.length} ${searchedFileUnit}) to ${options.output}.`,
      );
    } else {
      results.forEach((r) => console.log(JSON.stringify(r)));
    }
  });
