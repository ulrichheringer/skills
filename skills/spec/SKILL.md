---
name: spec
description: Turn a feature, change, or non-trivial bug into a short spec stored as a GitHub issue, with slices the tdd skill executes. Use for /spec.
disable-model-invocation: true
model: opus
effort: low
metadata:
  tier: think
argument-hint: "<task> | #issue"
---

# Spec

## 0. Size check
- Trivial, one obvious edit: say so and just do it.
- Bug with a clear cause: say so and use the `debug` skill.
- `#issue` given: read it with `gh issue view <n>` and refine it instead of starting over.

## 1. Understand
Read code from fresh base: clean tree → `git switch <base> && git pull --ff-only` (`master` if it exists, else `main`; skip the pull without a remote); dirty → ask first.
Explore only the affected area. When it spans many files, delegate to a read-only exploration subagent if the harness has one, and keep only its summary: files, entry points, test seams.
- How it works today, files involved, the closest existing test to copy.
- Fix: reproduce it, then state the root cause or best hypothesis with evidence.
- Find the exact single-test, full-suite, typecheck, and lint commands.

## 2. Clarify
Ask only what the code can't answer, max 5, each with your recommended answer. Use the AskUserQuestion tool when the harness has one: it keeps the whole run in one turn, on this skill's model. Otherwise one question per message. Decide minor calls yourself and list them under Decisions.

## 3. Write
```markdown
## Problem
<one paragraph, from the user's side>

## Current state
- <how it works now> `path/file.ts:42`
- Root cause: <fixes only>

## Placement
- `<domain folder>`: <what goes there>, following PROJECT.md `## Structure` / AGENTS.md layout

## Decisions
- <decision> — <why>

## Out of scope
- <item>

## Design
- <screen spec or mockup reference> → reuse `<component path>`, tokens from `<tokens file>`

## Verify
- single: `<cmd> <file>`
- all: `<test && typecheck && lint>`

## Slices
- [ ] <observable behavior> — test: <what proves it>
```
- Slices: vertical, smallest testable behavior, in build order. Prefactor first if it makes the change easy.
- Every slice has an automated test. No manual-only slices.
- Paths are fine; the spec is short-lived.
- Placement is required: new code goes into its domain's slice, never into a catch-all folder. No structure decided yet: propose one in Decisions.
- `## Design` only for UI work in a project with a design system or mockups; omit otherwise.
- Max ~50 lines. No user stories, no code.

## 4. Store
Show the spec. On approval:
- GitHub remote: `gh issue create --title "<title>" --body-file <tmp>`.
- No remote: write `.git/specs/<slug>.md`.

Next: fresh session (`/clear` or `/new`), then the `tdd` skill with `#<n>` or the spec path.
