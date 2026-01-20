# classname-search

A CLI tool that searches **inside `class` and `className` attributes** and matches against **each class name individually**.

> [!IMPORTANT]  
> This documentation is written primarily for AI agents.  
> No extra context is provided for human readers.

## Why not grep?

1. **Matches each class name individually**
   - `grep` matches entire lines. This tool parses `class` and `className` attributes and matches against each class name separately, so you can target `flex-col` without matching `flex`.

2. **Structured output (JSONLines)**
   - The `search` command outputs results as JSONLines with file path, line number, matched string, and full class value—easy to parse and act on programmatically.

3. **Regex replacement with capture groups**
   - The `replace` command supports `$1`, `$2`, etc., enabling pattern-based bulk replacements (e.g., `-slate-(\d+)$` → `-neutral-$1`) in a single command.

## Subcommands

| Subcommand | Description                        |
| ---------- | ---------------------------------- |
| `stats`    | Count matched class names per file |
| `search`   | Search for class names             |
| `replace`  | Search and replace class names     |
| `remove`   | Remove class names                 |

## Usage

```bash
npx classname-search <subcommand> '<target-glob>' '<class-regex>' [options]
```

| Argument        | Description                                                                        |
| --------------- | ---------------------------------------------------------------------------------- |
| `<target-glob>` | Glob pattern for target files (fast-glob syntax). Quote to prevent shell expansion |
| `<class-regex>` | Regex pattern to match classes. Quote to prevent shell interpretation              |

### ⚠️ Windows CLI Issues

**PowerShell environment:**
To check if you're in PowerShell, run `echo --%`. If the output is empty, you're in PowerShell.
Always use the stop-parsing token (`--%`) with quotes. Without it, special characters may be silently modified, causing incorrect results without any error.
The tool automatically strips outer quotes from arguments.

**cmd.exe passthrough (when not using `--%`):**
`npx` may pass through cmd.exe internally on Windows, which consumes `^` as an escape character.
To check if `^` is consumed, run `npx -y node -e "console.log(process.argv[1])" "^test"`. If the output is `test` instead of `^test`, escape `^` as `^^` (e.g., `^flex$` → `^^flex$`). Without this, results will be silently incorrect.

## Limitations

- **Supported attributes**: Only `class` and `className` attributes are targeted.
- **One attribute per line**: If a line contains multiple `class` or `className` attributes, only the first one is processed.
- **Multi-line attributes are ignored**: Class attributes spanning multiple lines are not matched.
- **Dynamic values are ignored**: Only values enclosed in double or single quotes are targeted. Attributes using JSX expressions (e.g., `className={...}`) are skipped.
- **Comments are processed**: The tool does not ignore commented-out code.
- **Files outside CWD are ignored**: The tool only processes files within the current working directory.

---

## stats

Count matched class names per file.

```bash
npx classname-search stats '<target-glob>' '<class-regex>' [options]
```

**Arguments/Options:**

| Argument/Option | Description                                          |
| --------------- | ---------------------------------------------------- |
| `-v, --verbose` | Show detailed output including files with no matches |

### Examples

**Command:**

```bash
npx classname-search stats 'src/components/**/*.jsx' 'text-'
```

**Output:**

```text
src/components/Header.jsx: 3 matches
src/components/Main.jsx: 4 matches

Total: 7 matches in 2 files
```

---

**Command:**

```bash
npx classname-search stats --verbose 'src/components/**/*.jsx' 'text-'
```

**Output:**

```text
src/components/Header.jsx: 3 matches
src/components/Main.jsx: 4 matches
src/components/Footer.jsx: 0 matches

Total: 7 matches in 3 files
```

## search

Search for class names.

```bash
npx classname-search search '<target-glob>' '<class-regex>' [options]
```

**Arguments/Options:**

| Argument/Option       | Description                        |
| --------------------- | ---------------------------------- |
| `-o, --output <file>` | Output results to a JSONLines file |

**Output Format (JSONLines):**

Each match is output as a JSON object on a separate line.

| Field        | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `file`       | File path relative to the current working directory        |
| `line`       | Line number (1-based)                                      |
| `matched`    | The substring that matched the regex pattern               |
| `className`  | The individual class name that contains the matched string |
| `classValue` | Full value of the class attribute                          |

### Examples

**Command:**

```bash
npx classname-search search 'src/components/**/*.jsx' 'flex'
```

**Output:**

<!-- prettier-ignore-start -->
```jsonl
{"file":"src/components/Header.jsx","line":3,"matched":"flex","className":"flex","classValue":"flex flex-col"}
{"file":"src/components/Header.jsx","line":3,"matched":"flex","className":"flex-col","classValue":"flex flex-col"}
{"file":"src/components/Header.jsx","line":4,"matched":"flex","className":"inline-flex","classValue":"inline-flex"}
```
<!-- prettier-ignore-end -->

---

**Command:**

```bash
npx classname-search search 'src/components/**/*.jsx' '^flex$'
```

**Output:**

<!-- prettier-ignore-start -->
```jsonl
{"file":"src/components/Header.jsx","line":3,"matched":"flex","className":"flex","classValue":"flex flex-col"}
```
<!-- prettier-ignore-end -->

---

**Command:**

```bash
npx classname-search search 'src/components/**/*.jsx' '^items-.+'
```

**Output:**

<!-- prettier-ignore-start -->
```jsonl
{"file":"src/components/Header.jsx","line":5,"matched":"items-start","className":"items-start","classValue":"items-start"}
```
<!-- prettier-ignore-end -->

---

**Command:**

```bash
npx classname-search search 'src/components/**/*.jsx' '^gap-\[.+\]$'
```

**Output:**

<!-- prettier-ignore-start -->
```jsonl
{"file":"src/components/Header.jsx","line":6,"matched":"gap-[10px]","className":"gap-[10px]","classValue":"gap-[10px]"}
```
<!-- prettier-ignore-end -->

## replace

Search and replace class names.

```bash
npx classname-search replace '<target-glob>' '<class-regex>' '<replacement>' [options]
```

**Arguments/Options:**

| Argument/Option | Description                            |
| --------------- | -------------------------------------- |
| `<replacement>` | String to replace matched classes with |

> [!NOTE]  
> When a class is replaced with an empty string, extra whitespace is automatically removed to maintain single-space separation.

**Output:**

```text
Replaced <N> matches of "<class-regex>" with "<replacement>" in <N> files.
```

### Examples

**Basic usage:**

```bash
# Replace "fixed" with "absolute"
npx classname-search replace 'src/components/**/*.jsx' '^fixed$' 'absolute'
# Replace "-red-100" with "-red-200"
npx classname-search replace 'src/components/**/*.jsx' -- '-red-100$' '-red-200'
```

**Using capture groups:**

```bash
# Migrate slate colors to neutral
# ✅ bg-slate-100 → bg-neutral-100
# ✅ text-slate-200 → text-neutral-200
# ❌ bg-slate-300/50
npx classname-search replace 'src/components/**/*.jsx' -- '-slate-(\d+)$' '-neutral-$1'

# Migrate blue colors to indigo
# ✅ text-blue-400 → text-indigo-400
# ✅ bg-blue-500 → bg-indigo-500
# ❌ border-blue-600
npx classname-search replace 'src/components/**/*.jsx' '(text|bg)-blue-(\d+)$' '$1-indigo-$2'

# Change breakpoint md: to lg:
# ✅ md:hidden → lg:hidden
# ✅ md:flex → lg:flex
# ❌ sm:hidden
npx classname-search replace 'src/components/**/*.jsx' '^md:(.+)$' 'lg:$1'
```

## remove

Remove class names.

```bash
npx classname-search remove '<target-glob>' '<class-regex>'
```

> [!NOTE]
> This command is equivalent to `replace '<target-glob>' '<class-regex>' ''`.
> Extra whitespace is automatically removed to maintain single-space separation.

**Output:**

```text
Removed <N> matches of "<class-regex>" in <N> files.
```

### Examples

```bash
# Remove "font-normal" class
npx classname-search remove 'src/components/**/*.jsx' '^font-normal$'

# Remove all slate color classes
npx classname-search remove 'src/components/**/*.jsx' -- '-slate-\d+'
```
