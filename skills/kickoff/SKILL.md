---
name: kickoff
description: Plan a new project from zero before any code - problem, scope, architecture, risks, roadmap - then scaffold it. Use for /kickoff.
disable-model-invocation: true
argument-hint: "<project idea>"
---

# Kickoff

Deep planning for a new project. The one place worth spending tokens: mistakes here multiply.

## 1. Interview
One question per message, plain words, with your recommended answer. Stop when every section of `PROJECT.md` can be written.
- Problem: who has it, how it's solved today, what success looks like.
- Users and the core flow they repeat.
- MVP: the smallest version that solves the problem. Everything else goes to Out of scope.
- Constraints: stack (default TypeScript; Go for services and CLIs), hosting, integrations, deadlines.

## 2. Decide
- Data model, boundaries (HTTP, DB, external APIs), deploy target. One line each, with why.
- Boring, proven tools. No dependency without a concrete need.
- An unknown that could flip a decision: build a throwaway prototype in a temp dir and decide from the result.

## 3. Write `PROJECT.md` at repo root
```markdown
# <Name>
<one-line pitch>

## Problem
## Users
## MVP
## Out of scope
## Architecture
- <decision> — <why>
## Risks
- <risk> — <mitigation>
## Roadmap
- [ ] <vertical slice of value, in build order>
```
Show it. Iterate until approved.

## 4. Scaffold (after approval)
- Invoke the `lean-code` skill and the language skill (`typescript`, `go`) first.
- Minimal structure, test runner, lint, typecheck, CI running all three.
- One passing smoke test.
- Run the `project-context` skill to write `CLAUDE.md`.
- `git init -b master`, then commit everything: `chore: scaffold`.

Next: `/spec <first roadmap item>`.
