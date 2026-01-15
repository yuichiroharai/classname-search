#!/usr/bin/env node
import { Command } from "commander";
import { replaceCommand } from "./commands/replace.js";
import { searchCommand } from "./commands/search.js";
import { statsCommand } from "./commands/stats.js";
import { pkg } from "./utils/pkg.js";

const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.addCommand(searchCommand);
program.addCommand(replaceCommand);
program.addCommand(statsCommand);

program.parse();
