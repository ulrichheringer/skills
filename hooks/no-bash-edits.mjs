import { fileURLToPath } from "node:url";

const scratch = String.raw`(?!/tmp|/dev|/private/tmp)`;
const target = String.raw`${scratch}[^\s|;&<>]+`;
const patterns = [
  /\b(?:sed|perl)\s+(?:-[a-zA-Z]+\s+)*-[a-zA-Z]*i/,
  new RegExp(String.raw`\b(?:cat|tee)\b[^\n|;&]*?(?:>>?\s*${target}[^\n|;&]*<<|<<[^\n|;&]*?(?:>>?\s*|tee\s+(?:-a\s+)?)${target})`),
  new RegExp(String.raw`\btee\s+(?:-a\s+)?${target}[^\n|;&]*<<`),
  /\bpython3?\b[\s\S]*?\bopen\([\s\S]*?(?:\.write\(|['"][wa]\+?['"])/,
];

export const blockReason =
  "Blocked: change project files with the edit/write tools, not shell scripts (python, cat/tee heredoc, sed -i). They run diagnostics and show diffs.";

export const isBashEdit = (command = "") => patterns.some((pattern) => pattern.test(command));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  const { tool_name, tool_input } = JSON.parse(input || "{}");
  if (tool_name === "Bash" && isBashEdit(tool_input?.command)) {
    console.error(blockReason);
    process.exit(2);
  }
}
