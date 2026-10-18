import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { blockReason, isBashEdit } from "../hooks/no-bash-edits.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const roles: Record<string, string> = { think: "@slow", build: "@default", light: "@smol" };

const read = (path: string) => readFileSync(join(root, path), "utf8");
const body = (markdown: string) => markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
const terse = body(read("skills/terse/SKILL.md"));
const ownSkills = new Set(readdirSync(join(root, "skills")));
const builtinCommands = new Set(["debug"]);

const tierOf = (skill: string) => {
  try {
    return read(`skills/${skill}/SKILL.md`).match(/^\s+tier:\s*(\w+)/m)?.[1];
  } catch {
    return undefined;
  }
};

const pinReviewerModel = async (pi: any) => {
  const { lookup } = await import("@oh-my-pi/pi-coding-agent/config/registry");
  const overrides = lookup("task.agentModelOverrides");
  const current = overrides?.get(pi.pi.settings) ?? {};
  if (!current["slice-reviewer"]) overrides?.override(pi.pi.settings, { ...current, "slice-reviewer": roles.light });
};

export default function skills(pi: any) {
  pinReviewerModel(pi).catch(() => undefined);

  pi.on("input", async (event: { text: string }, ctx: any) => {
    const [, prefix, skill, rest] = event.text.match(/^\/(skill:)?(?:[\w-]+\/)?([\w-]+)([\s\S]*)$/) ?? [];
    const bare = !prefix && ownSkills.has(skill) && !builtinCommands.has(skill);
    if (!skill || (!prefix && !bare)) return undefined;
    const role = roles[tierOf(skill) ?? ""];
    const model = role && ctx.models.resolve(role);
    if (model) await pi.setModel(model);
    return bare ? { text: `/skill:${skill}${rest}` } : undefined;
  });

  pi.on("before_agent_start", (event: { systemPrompt: string[] }) => ({
    systemPrompt: [...event.systemPrompt, terse],
  }));

  pi.on("tool_call", (event: { toolName: string; input: any }) =>
    event.toolName === "bash" && isBashEdit(event.input?.command) ? { block: true, reason: blockReason } : undefined,
  );

  pi.on("tool_call", (event: { toolName: string; input: any }) => {
    const { agent, tasks, ...rest } = event.input ?? {};
    if (event.toolName !== "task" || typeof agent !== "string" || !Array.isArray(tasks)) return undefined;
    const pick = (own?: string) => (own && own !== "task" ? own : agent);
    return { input: { ...rest, tasks: tasks.map((task: { agent?: string }) => ({ ...task, agent: pick(task.agent) })) } };
  });

  pi.on("before_subagent_spawn", (event: { agent: string }) =>
    event.agent.endsWith("slice-reviewer") ? { model: [roles.light] } : undefined,
  );
}
