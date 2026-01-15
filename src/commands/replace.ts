import { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";
import { extractClassNames } from "../common/class-names.js";
import { addCommonArgs, prepareContext } from "../common/commands.js";
import { removeQuotes } from "../utils/args.js";

export const replaceCommand = addCommonArgs(new Command("replace"))
  .description("Search and replace class names")
  .argument("<replacement>", "String to replace matched classes with")
  .action(
    async (
      targetGlob: string,
      classRegex: string,
      replacement: string,
      options,
    ) => {
      // Strip quotes preserved by PowerShell when using --%.
      replacement = removeQuotes(replacement);

      const { filteredFiles, regex } = await prepareContext(
        targetGlob,
        classRegex,
        options,
      );

      let matchCount = 0;

      for (const file of filteredFiles) {
        const content = await readFile(file, "utf-8");
        const lines = content.split("\n");
        const newLines: string[] = [];
        let fileChanged = false;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          const extracted = extractClassNames(line);

          if (!extracted) {
            newLines.push(line);
            continue;
          }

          const { classAttribute, quote, classNames } = extracted;
          let lineChanged = false;

          const newClassNames = classNames.map((className) => {
            const match = className.match(regex);
            if (match) {
              matchCount++;
              lineChanged = true;
              return className.replace(regex, replacement);
            } else {
              return className;
            }
          });

          if (lineChanged) {
            const newContent = newClassNames.filter((c) => c !== "").join(" ");
            const prefix = classAttribute.slice(
              0,
              classAttribute.indexOf(quote) + 1,
            );
            const reconstructedMatch = `${prefix}${newContent}${quote}`;
            newLines.push(line.replace(classAttribute, reconstructedMatch));
            fileChanged = true;
          } else {
            newLines.push(line);
          }
        }

        if (fileChanged) {
          await writeFile(file, newLines.join("\n"), "utf-8");
        }
      }

      const matchUnit = matchCount === 1 ? "match" : "matches";
      const fileUnit = filteredFiles.length === 1 ? "file" : "files";
      console.log(
        `Replaced ${matchCount} ${matchUnit} of "${classRegex}" with "${replacement}" in ${filteredFiles.length} ${fileUnit}.`,
      );
    },
  );
