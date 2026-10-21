# skills

Lean, TDD-first development workflow skills for Claude Code. TypeScript first, Go second.

## Workflow

| Size | Path |
|------|------|
| New project | `/kickoff` → `/spec` per roadmap item, or `/autopilot` |
| Roadmap already decided | `/autopilot`: spec → tdd → ship → merge for every open item; stops on blockers |
| Trivial | ask directly → `/ship` |
| Bug, clear cause | `/debug` → `/ship` → `/pr-loop` |
| Feature or unclear bug | `/spec` → `/clear` → `/tdd #n` → `/self-review` (fresh session) → `/ship` → `/pr-loop` |
| Someone else's PR | `/review-pr <n>` |
| Agent keeps repeating a mistake | `/retro` |
| Existing project, no context | `/project-context` |

Specs live in GitHub issues (fallback `.git/specs/`). Progress lives in git: one commit per slice.

## Skills

| Skill | Trigger |
|-------|---------|
| kickoff, spec, tdd, debug, self-review, review-pr, ship, pr-loop, retro, autopilot | user |
| project-context, lean-code, typescript, go | user or model |
| terse | every session (SessionStart) + one-line reminder per prompt |
| `slice-reviewer` agent (Haiku) | launched by `tdd` |
| `autopilot-planner` (Opus), `autopilot-builder` (Sonnet) agents | launched by `autopilot` |

Invoke by bare name (`/tdd`); `/skills:tdd` also works.

## Install

```bash
claude plugin marketplace add ulrichheringer/skills
claude plugin install skills@ulrichheringer
```

Development, edits apply on the next session:
```bash
claude --plugin-dir ~/dev/skills
```

Optional: add `CLAUDE.global.md` to `~/.claude/CLAUDE.md`.

oh my pi:
```bash
omp plugin marketplace add ulrichheringer/skills
omp plugin install skills@ulrichheringer
```
Invoke as `/tdd` (same as Claude Code) or `/skill:tdd`; `debug` needs `/skill:debug` because omp has a built-in `/debug`. The bundled extension injects terse rules, switches model per skill tier, and runs `slice-reviewer` on `@smol`.

## Guards

Both harnesses block file edits through bash (python `open().write`, `cat`/`tee` heredocs, `sed -i`, `perl -i`) so changes go through the edit/write tools. Writes under `/tmp` are allowed. Detector: `hooks/no-bash-edits.mjs`.

## Model tiers

Skills declare `metadata.tier` and a Claude Code `model`. Claude Code applies a skill's model only to the turn that invokes it; your replies go back to the session model, so keep the session on Opus (`/model opus`) for multi-turn interviews in `kickoff` and `spec`.

| Tier | Skills | Claude Code | oh my pi role |
|------|--------|-------------|---------------|
| think | kickoff, spec, self-review, review-pr, retro | `opus` for the turn | `@slow` |
| build | tdd, debug, ship, pr-loop | `sonnet` for the turn | `@default` |
| light | slice-reviewer | `haiku` | `@smol` |

## Credits

- `typescript` adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack), MIT.
- `ship/scripts/format.mjs` from [before-and-after](https://github.com/vercel-labs/before-and-after), PolyForm Shield 1.0.0.
