/**
 * Search result (each line in JSONL output)
 * @property file - File path relative to the current working directory
 * @property line - Line number (1-based)
 * @property matched - The substring that matched the regex pattern
 * @property className - The individual class name that contains the matched string
 * @property classValue - Full value of the class attribute
 */
export interface MatchItem {
  file: string;
  line: number;
  matched: string;
  className: string;
  classValue: string;
}
