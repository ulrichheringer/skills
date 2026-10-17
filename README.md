# skills

Lean, TDD-first development workflow skills for Claude Code. TypeScript first, Go second.

## Workflow

| Size | Path |
|------|------|
| New project | `/kickoff` → `/spec` per roadmap item |
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
| kickoff, project-context, spec, tdd, debug, self-review, review-pr, ship, pr-loop, retro | user |
| lean-code, typescript, go | model |
| terse | every session (SessionStart) + one-line reminder per prompt |
| `slice-reviewer` agent (Haiku) | launched by `tdd` |

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

## Credits

- `typescript` adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack), MIT.
- `ship/scripts/format.mjs` from [before-and-after](https://github.com/vercel-labs/before-and-after), PolyForm Shield 1.0.0.
