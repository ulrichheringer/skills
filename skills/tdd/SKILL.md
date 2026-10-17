---
name: tdd
description: Implement a spec slice by slice with strict red-green-refactor, one commit per slice. Use for /tdd.
disable-model-invocation: true
model: sonnet
metadata:
  tier: build
argument-hint: "#issue | .git/specs/<file> | <task>"
---

# TDD

## Load
- Spec: `gh issue view <n> --json title,body -q '.title + "\n\n" + .body'`, a `.git/specs/` file, or the task text.
- Base: `master` if it exists, else `main`. Neither exists or no commits: stop and ask the user to commit the base first.
- Resume: `git log --oneline <base>..HEAD` and `git status --short`. A slice with a commit is done; uncommitted changes belong to the next open slice.
- On the base branch: create `<feat|fix>/<slug>` first.
- Invoke the `lean-code` skill and the language skill (`typescript`, `go`) before writing code.
- Read only files named in Current state and those the next test touches.

## Cycle, per slice
1. Red: one test for the slice's behavior through the public interface. Run it alone. It must fail for the expected reason; show the failure line.
2. Green: the minimum code that passes. Run the single test.
3. Refactor: simplify while green, per `lean-code`.
4. Commit: `git commit -m "<feat|fix>: <slice>"`.

Track progress in context. Don't edit the spec per slice.

## Rules
- No production code without a failing test. Never weaken, skip, or delete a test to pass.
- Test behavior, not internals. Don't mock what runs locally.
- Small output: single-file runs, quiet reporter, failing lines only.
- Stuck after 3 attempts on a slice: stop and report what was tried and the suspected cause.

## Finish
1. Run the spec's Verify `all`. Show the summary lines as proof. Not green means not done.
2. Launch the `slice-reviewer` subagent with only: the spec reference and base ref `<base>`. Run its checklist yourself only if the harness has no subagent tool at all.
3. Fix valid findings through the cycle. Dismiss the rest with a one-line reason. Never dismiss a finding that cites a `lean-code`, `typescript`, or `go` rule.
4. Report: slices done, proof lines, reviewer result.

Next: the `self-review` skill in a fresh session, or `ship`.
