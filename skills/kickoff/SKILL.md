---
name: kickoff
description: Plan a new project from zero before any code - problem, scope, architecture, risks, roadmap - then scaffold it. Use for /kickoff.
disable-model-invocation: true
model: opus
metadata:
  tier: think
argument-hint: "<project idea>"
---

# Kickoff

Deep planning for a new project. The one place worth spending tokens: mistakes here multiply.

## 0. References
Read every file, folder, or URL the user passes (designs, specs, prototypes, notes) before asking anything. Never ask what they already answer; list what you took from them.

## 1. Interview
One question per message, plain words, with your recommended answer. Stop when every section of `PROJECT.md` can be written.
- Problem: who has it, how it's solved today, what success looks like.
- Users and the core flow they repeat.
- MVP: the smallest version that solves the problem. Everything else goes to Out of scope.
- Constraints: stack (default TypeScript; Go for services and CLIs), hosting, integrations, deadlines.

## 2. Decide
- Data model, boundaries (HTTP, DB, external APIs), deploy target. One line each, with why.
- Code structure: default to vertical slices by domain (one folder per domain holding its handlers, logic, data access, UI, and tests; shared kernel only for truly cross-cutting code). Name the domains and the folder layout per app.
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
## Structure
- <app>: `<path>/<domain>/` holds <handler, logic, store, tests | routes, api, components, tests>
- Domains: <list>
- Shared: `<path>` only for <cross-cutting concerns>
## Risks
- <risk> — <mitigation>
## Roadmap
- [ ] <vertical slice of value, in build order>
```
Each roadmap item fits one spec (about 3–8 slices); split anything bigger.
Show it. Iterate until approved. On approval, commit it right away: `git init -b master` if there is no repo, then commit only `PROJECT.md` as `docs: project plan`.

## 4. Scaffold (after approval)
- Invoke the `lean-code` skill and the language skill (`typescript`, `go`) first.
- Minimal structure, test runner, lint, typecheck, CI running all three.
- One passing smoke test.
- Run the `project-context` skill to write `AGENTS.md`.
- Commit everything: `chore: scaffold`.

Next: the `spec` skill on the first roadmap item.
