---
name: spec
description: Turn a feature, change, or non-trivial bug into a short spec stored as a GitHub issue, with slices /tdd executes. Use for /spec.
disable-model-invocation: true
argument-hint: "<task> | #issue"
---

# Spec

## 0. Size check
- Trivial, one obvious edit: say so and just do it.
- Bug with a clear cause: say so and use `/debug`.
- `#issue` given: read it with `gh issue view <n>` and refine it instead of starting over.

## 1. Understand
Explore only the affected area. When it spans many files, delegate to an Explore subagent and keep only its summary: files, entry points, test seams.
- How it works today, files involved, the closest existing test to copy.
- Fix: reproduce it, then state the root cause or best hypothesis with evidence.
- Find the exact single-test, full-suite, typecheck, and lint commands.

## 2. Clarify
Ask only what the code can't answer. One question per message, max 5, each with your recommended answer. Decide minor calls yourself and list them under Decisions.

## 3. Write
```markdown
## Problem
<one paragraph, from the user's side>

## Current state
- <how it works now> `path/file.ts:42`
- Root cause: <fixes only>

## Decisions
- <decision> — <why>

## Out of scope
- <item>

## Verify
- single: `<cmd> <file>`
- all: `<test && typecheck && lint>`

## Slices
- [ ] <observable behavior> — test: <what proves it>
```
- Slices: vertical, smallest testable behavior, in build order. Prefactor first if it makes the change easy.
- Paths are fine; the spec is short-lived.
- Max ~50 lines. No user stories, no code.

## 4. Store
Show the spec. On approval:
- GitHub remote: `gh issue create --title "<title>" --body-file <tmp>`.
- No remote: write `.git/specs/<slug>.md`.

Next: `/clear`, then `/tdd #<n>`.
