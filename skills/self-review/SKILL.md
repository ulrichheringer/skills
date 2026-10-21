---
name: self-review
description: Deep review of the current branch before shipping. Use for /self-review, ideally in a fresh session.
disable-model-invocation: true
model: opus
metadata:
  tier: think
argument-hint: "[#issue]"
---

# Review

Base: `git branch --list master main`, prefer `master`.
Scope: `git diff <base>...HEAD` plus uncommitted changes.
Spec: the issue if given, else the newest file in `.git/specs/`.
Run the project's test, typecheck, and lint once. Read surrounding code only where a hunk's correctness depends on it.

Check in order:
1. Correctness: logic, edge cases (empty, null, huge, concurrent, unicode), error paths, security (injection, authz, secrets).
2. Spec: missing or extra behavior.
3. Tests: uncovered behavior, tests that can't fail.
4. Simplicity: code that can be deleted or shortened, one-caller abstractions.
5. Rules: `lean-code`, `typescript`, `go`.

Skip nits a linter catches. Don't re-review code unchanged since an earlier review.

Output one line per finding, worst first:
`path:line: [high|med|low] <problem>. <fix>.`
Then ask which to fix. Nothing found: `No issues.`
