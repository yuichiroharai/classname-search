import packageJson from "../../package.json" with { type: "json" };

export const pkg = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
};
