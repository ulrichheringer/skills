import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const skills = new URL("../skills/", import.meta.url);

for (const name of ["kickoff", "spec", "self-review", "review-pr", "app"]) {
  const source = readFileSync(new URL(`${name}/SKILL.md`, skills), "utf8");
  const hard = source
    .replace(`name: ${name}\n`, `name: ${name}-hard\n`)
    .replace("effort: low\n", "effort: medium\n")
    .replace(/^description: (.*)$/m, (_, d) => `description: ${d.replace(new RegExp(`/${name}(?![\\w-])`), `/${name}-hard`)} Medium effort.`);
  mkdirSync(new URL(`${name}-hard/`, skills), { recursive: true });
  writeFileSync(new URL(`${name}-hard/SKILL.md`, skills), hard);
}
