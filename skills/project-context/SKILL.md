---
name: project-context
description: Write or refresh a minimal AGENTS.md (plus a CLAUDE.md pointer) for the current project. Use for /project-context or when kickoff finishes a scaffold.
---

# Project context

Write `AGENTS.md` at repo root with only what an agent would get wrong or waste tokens discovering. English. Max ~20 lines.

## Gather cheaply
- Manifests and config: `package.json` scripts, `go.mod`, `Makefile`, CI workflows, test and lint config.
- Layout: `git ls-files | cut -d/ -f1-2 | sort -u | head -60`.
- Existing `CLAUDE.md`, `AGENTS.md`, `PROJECT.md`: keep what's still true.
- Don't read source files beyond what naming the layout needs.

## Template
```markdown
# <Name>
<stack in one line: language, runtime, framework, db, test runner>

## Commands
- test: `<cmd>`
- single test: `<cmd> <file>`
- typecheck: `<cmd>`
- lint: `<cmd>`

## Layout
- `<dir>` <role>

## Conventions
- <only non-obvious rules: error style, where validation lives, naming>
- UI: only tokens from `<tokens file>` and components from `<components dir>`; no ad-hoc colors, spacing, or fonts. Reference: `<design docs>`.

## Skills
- Editing .ts/.tsx: use `typescript` if available.
- Editing .go: use `go` if available.
- Writing code: use `lean-code` if available.
```
Keep only the Skills lines for languages present, and the UI line only when the project has a design system.

## Rules
- No generic advice, nothing a linter or formatter enforces.
- Commands exact and runnable. Verify each one runs.
- Write `CLAUDE.md` containing only `@AGENTS.md` so Claude Code loads it.
- Existing file: show the diff before overwriting.
