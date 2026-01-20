import { Command } from "commander";
import { addCommonArgs } from "../common/commands.js";
import { replaceAction } from "./replace.js";

export const removeCommand = addCommonArgs(new Command("remove"))
  .description("Remove class names")
  .action((targetGlob: string, classRegex: string, options) =>
    replaceAction(targetGlob, classRegex, "", options, "Removed"),
  );
