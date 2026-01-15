import fg from "fast-glob";
import { filterFilesWithinCwd } from "../utils/paths.js";

export const getTargetFiles = async (
  targetGlob: string,
  options: { force?: boolean; ignore?: string[] },
): Promise<string[]> => {
  const files = await fg(targetGlob, { ignore: options.ignore });
  const cwd = process.cwd();
  return options.force ? files : filterFilesWithinCwd(files, cwd);
};
