---
name: classname-search
description: A CLI tool that searches inside class and className attributes and matches against each class name individually. Use this instead of grep when searching or replacing class names.
---

# Class Name Search Guide

## Count matched class names per file

> [!WARNING]  
> AI manual counting is unreliable. Always use this command to count class names.

**Command:**

```bash
npx classname-search stats 'src/**/*.jsx' 'text-'
```

**Output:**

```text
src/components/Header.jsx: 3 matches
src/components/Main.jsx: 4 matches

Total: 7 matches in 2 files
```

> [!NOTE]  
> By default, only files containing matched class names are listed.  
> Use the `--verbose` option if you want to include files with 0 matches in the output.

## Search for class names

**Command:**

```bash
npx classname-search search 'src/components/**/*.jsx' 'flex'
```

**Output (search):**

<!-- prettier-ignore-start -->
```jsonl
{"file":"src/components/Header.jsx","line":3,"matched":"flex","className":"flex","classValue":"flex flex-col"}
{"file":"src/components/Header.jsx","line":3,"matched":"flex","className":"flex-col","classValue":"flex flex-col"}
{"file":"src/components/Header.jsx","line":4,"matched":"flex","className":"inline-flex","classValue":"inline-flex"}
```
<!-- prettier-ignore-end -->

> [!IMPORTANT]  
> `matched` is the regex match; `className` is the full class name containing that match.

**File output:**

Use `--output <file>` for large results or when requested by the user.  
Working from file output is **strongly recommended** to avoid truncation and hallucination.

## Search and replace class names

**Command:**

```bash
npx classname-search replace 'src/components/**/*.jsx' -- '-slate-(\d+)$' '-neutral-$1'
```

**Output:**

```text
Replaced 8 matches of "-slate-(\d+)$" with "-neutral-$1" in 3 files.
```

## CLI Reference

Fetch `https://raw.githubusercontent.com/yuichiroharai/classname-search/main/README.md`
