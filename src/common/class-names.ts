export const CLASS_ATTRIBUTE_REGEX =
  /\b(class|className)\s*=\s*(["'])((?:\\.|(?!\2).)*)\2/;

export function extractClassNames(line: string) {
  const match = line.match(CLASS_ATTRIBUTE_REGEX);
  if (!match) return null;

  const attrValue = match[3].trim();
  if (!attrValue) return null;

  const classAttribute = match[0];
  const quote = match[2];

  const classNames = attrValue.split(/\s+/);
  const classValue = classNames.join(" ");

  return {
    classAttribute,
    classNames,
    classValue,
    quote,
  };
}
