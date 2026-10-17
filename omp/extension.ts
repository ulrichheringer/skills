import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const roles: Record<string, string> = { think: "@slow", build: "@default", light: "@smol" };

const read = (path: string) => readFileSync(join(root, path), "utf8");
const body = (markdown: string) => markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
const terse = body(read("skills/terse/SKILL.md"));

const tierOf = (skill: string) => {
  try {
    return read(`skills/${skill}/SKILL.md`).match(/^\s+tier:\s*(\w+)/m)?.[1];
  } catch {
    return undefined;
  }
};

export default function skills(pi: any) {
  pi.on("input", async (event: { text: string }, ctx: any) => {
    const skill = event.text.match(/^\/skill:(?:[\w-]+\/)?([\w-]+)/)?.[1];
    const role = skill && roles[tierOf(skill) ?? ""];
    const model = role && ctx.models.resolve(role);
    if (model) await pi.setModel(model);
  });

  pi.on("before_agent_start", (event: { systemPrompt: string[] }) => ({
    systemPrompt: [...event.systemPrompt, terse],
  }));

  pi.on("before_subagent_spawn", (event: { agent: string }) =>
    event.agent.endsWith("slice-reviewer") ? { model: [roles.light] } : undefined,
  );
}
