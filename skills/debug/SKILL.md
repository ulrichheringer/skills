---
name: debug
description: Fix a bug test-first - reproduce, find the root cause, prove the fix. Use for /debug.
disable-model-invocation: true
model: sonnet
metadata:
  tier: build
argument-hint: "<symptom> | #issue"
---

# Debug

1. Reproduce: exact input, observed vs expected. No repro yet: gather evidence (stack trace, logs, failing request) before touching code.
2. Locate: walk back from the symptom along the stack trace or data flow. Grep before reading; read narrow ranges. Summarize logs, never paste them whole.
3. Root cause: the first place the system goes wrong, in one sentence with evidence. Two failed fixes on one premise: re-test the premise.
4. Red: a test that reproduces the bug. It must fail.
5. Green: the smallest fix at the root cause. No guard that hides a state that should never exist.
6. Run the single test, then the full suite, typecheck, and lint. Show the proof lines.
7. Commit `fix: <behavior>`.

Cause unclear or the fix spans several modules: stop and suggest the `spec` skill.

Report: root cause, fix, proof. Next: the `ship` skill.
