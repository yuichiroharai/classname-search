import { execa } from "execa";

export async function needsCaretEscape(): Promise<boolean> {
  const { stdout } = await execa("node", [
    "-e",
    "console.log(process.argv[1])",
    "^",
  ]);
  return stdout.trim() !== "^";
}

export function escapeCaret(str: string, needsCaretEscape: boolean): string {
  return needsCaretEscape ? str.replace(/\^/g, "^^") : str;
}
