import * as path from "path";

export const isWithinCwd = (filePath: string, cwd: string): boolean => {
  const normalizedCwd = cwd.replace(/\\/g, "/");
  const absolutePath = path.resolve(cwd, filePath).replace(/\\/g, "/");
  return absolutePath.startsWith(normalizedCwd + "/");
};

export const filterFilesWithinCwd = (
  files: string[],
  cwd: string,
): string[] => {
  return files
    .filter((file) => isWithinCwd(file, cwd))
    .map((file) => {
      const absolutePath = path.resolve(cwd, file);
      const relativePath = path.relative(cwd, absolutePath);
      return relativePath.replace(/\\/g, "/");
    });
};
