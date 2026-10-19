---
name: autopilot
description: Work through every open PROJECT.md roadmap item unattended - spec, tdd, ship, merge, next. Use for /autopilot.
disable-model-invocation: true
model: sonnet
metadata:
  tier: build
argument-hint: "[first item to start from]"
---

# Autopilot

You orchestrate; phase agents do the work. Keep your own context small: pass pointers (item text, spec path or issue, PR number), never file contents.

Sibling skills: `<this skill's directory>/../<name>/SKILL.md`.
Phases are strictly sequential: wait for each agent's result before launching the next.

## Preconditions
Clean tree on the base branch (`master` if it exists, else `main`), `PROJECT.md` with a `## Roadmap`, verify commands in `AGENTS.md`. Missing: stop and say what.

## Loop, until no `- [ ]` item is left
1. Item: the first open roadmap item.
2. Spec: launch `autopilot-planner` with: "Follow `<spec skill path>` for: <item>. Autopilot mode: no questions; decide from PROJECT.md, AGENTS.md and the code. Return the spec path or issue, or `BLOCKED: <decision needed>` if an unsettled decision changes how it gets built."
3. Build: launch `autopilot-builder` with: "Follow `<tdd skill path>` for <spec>. Autopilot mode: no questions; skip the slice-reviewer step, autopilot runs it. Return `DONE <branch>` with proof lines, or `BLOCKED: <reason>`."
   Review: launch `slice-reviewer` with the spec and base ref. Findings: launch `autopilot-builder` once to fix them through the tdd cycle on that branch.
4. Ship: launch `autopilot-builder` with: "Follow `<ship skill path>` for <spec>, roadmap item `<item>`. Return the PR number."
5. Checks: `gh pr checks <n> --watch`. "No checks reported" means no CI: the build phase's verify is the gate, continue. Red: launch `autopilot-builder` to fix on the PR branch with the failing log tail; at most 2 attempts.
6. Merge: `gh pr merge <n> --merge --delete-branch`, then `git switch <base> && git pull --ff-only`.

No GitHub remote: skip 4–5, tick the item on the branch, `git switch <base> && git merge --no-ff <branch> && git branch -d <branch>`.

## Stop
Stop the whole run on: `BLOCKED` from any phase, red checks after 2 fixes, merge conflict, dirty tree between items. Never skip an item. Never force-push.

## Report
One line per finished item (PR link or merge commit), then where and why it stopped, or "Roadmap done."
