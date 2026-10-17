---
name: lean-code
description: Write the simplest, shortest working code with zero comments. Use whenever writing, editing, or refactoring code in any language.
---

# Lean code

- No comments: no docblocks, no TODOs, no commented-out code. Names and structure carry the meaning. Remove comments in code you touch.
- Solve only the stated problem. No options, flags, config, or extension points nobody asked for.
- No abstraction with one caller. Inline one-line helpers. No wrapper that only forwards.
- Reuse the codebase and standard library before writing new code or adding a dependency.
- Delete before adding: dead code, unused params, stale branches in what you touch.
- Plain functions and data over classes, patterns, and frameworks.
- Early returns over nesting. No `else` after `return`.
- Clear names over short ones. Obvious code over clever code.
- Validate at boundaries; no defensive checks for states the types rule out.
- Smallest diff that solves it. Don't reformat or refactor unrelated code.

Before finishing, reread the diff and delete every line that isn't needed.
