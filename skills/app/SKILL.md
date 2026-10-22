---
name: app
description: Plan a whole Android app in one go, then build it unattended milestone by milestone with TDD and local merges. Use for /app.
disable-model-invocation: true
model: opus
effort: low
metadata:
  tier: think
argument-hint: "<app idea | references>"
---

# App

One command: interview, one plan, then unattended build. The plan is made once; builders never re-spec.
Skills dir: the parent of this skill's base directory. Builder guide: `<skills dir>/app/milestone.md`.
Base branch: `master` if it exists, else `main`.

## Resume
`PROJECT.md` with an open `- [ ]` under `## Roadmap`: skip to Build from the first open milestone.

## 1. References
Read every file, folder, or URL the user passes before asking anything. Never ask what they already answer.

## 2. Interview
Use the AskUserQuestion tool, up to 4 related questions per call, each with your recommended answer first: it keeps the whole run in one turn, on this skill's model. Stop when the plan can be written.
- Problem, user, the core flow they repeat.
- Target size: medium. The core flows plus what makes it usable every day: persistence, empty/loading/error states, edit and delete, settings that matter, basic polish. Not a throwaway MVP, not the full product.
- Data: local only, or a backend/API. Auth, sync, notifications only when the idea needs them.

## 3. Decide
Defaults, change only with a reason: Kotlin, Jetpack Compose, Material 3, single activity, Navigation Compose, ViewModel + `StateFlow`, Room for local data, Ktor or Retrofit only with a backend, manual constructor DI, version catalog, minSdk 26, package `dev.<name>`.
Structure: vertical slices by domain, `app/src/main/java/<pkg>/<domain>/` holding screen, ViewModel, repository, data; `core/` only for theme, navigation, database setup.

## 4. Plan
Write `PROJECT.md`:
```markdown
# <Name>
<one-line pitch>

## Problem
## Users
## Scope
## Out of scope
## Architecture
- <decision> — <why>
## Structure
- `app/src/main/java/<pkg>/<domain>/`: screen, ViewModel, repository, data, with tests mirrored under `src/test` and `src/androidTest`
- Domains: <list>
## Risks
- <risk> — <mitigation>
## Verify
- unit: `./gradlew testDebugUnitTest`
- all: `./gradlew testDebugUnitTest lintDebug assembleDebug`
## Roadmap
### M0 Scaffold
- [ ] Gradle project builds, one passing unit test, app launches to an empty screen — test: smoke test + launch on emulator
### M1 <milestone name>
- [ ] <observable behavior> — test: <what proves it>
```
- 4–6 milestones after M0, each a usable increment in build order, 4–8 slices each.
- Slices: vertical, smallest testable behavior. Every slice has an automated test (unit for ViewModel/repository, Compose UI test for screens).
- Each milestone names its domain folder in the slice text when not obvious.

Ask approval with AskUserQuestion ("Build it" / "Change"). Iterate until approved. Then `git init -b master` if there is no repo and commit only `PROJECT.md` as `docs: app plan`.

## 5. Build, unattended
Keep your own context small: pass pointers, never file contents. Strictly sequential: wait for each agent before the next.
For each milestone with an open slice, in order:
1. Launch `autopilot-builder`: "Follow `<builder guide>` for milestone `M<n>`. Return `DONE <branch>` with proof lines, or `BLOCKED: <reason>`."
2. Launch `slice-reviewer` with spec "`PROJECT.md`, section `### M<n>`" and the base ref. Findings: launch `autopilot-builder` once: "Follow `<builder guide>` to fix these findings on `<branch>`: <findings>".
3. Merge: `git switch <base> && git merge --no-ff <branch> -m "merge: M<n> <name>" && git branch -d <branch>`.

Stop the run on: `BLOCKED`, merge conflict, dirty tree between milestones. Never skip a milestone. Never push unless the repo already has a remote and the user asked.

## 6. Report
One line per merged milestone with its merge commit and screenshot paths, then where and why it stopped, or "App done."
