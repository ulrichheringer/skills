---
name: retro
description: Turn a recurring agent mistake into a durable fix in tooling, CLAUDE.md, or a skill. Use for /retro.
disable-model-invocation: true
argument-hint: "<what went wrong>"
---

# Retro

1. Name the mistake in one sentence: what happened, where, which skill was active. Use only the part of the conversation that shows it.
2. Root cause: missing rule, vague rule, rule in the wrong place, or something a tool should enforce.
3. Pick the highest-leverage fix:
   - Tooling: lint rule, test, script, CI check. Enforced, zero tokens.
   - Project `CLAUDE.md`: a project-specific fact.
   - Skill: a workflow rule. Skills repo: `dirname "$(readlink ~/.claude/skills/<skill>)"`.
   - Global `~/.claude/CLAUDE.md`: a rule for every project.
4. Write the smallest edit. One line beats a paragraph. Tighten or replace existing text before adding. Keep each `SKILL.md` under ~60 lines.
5. Show the diff. Apply on approval.
