# Milestone build

Unattended: never ask the user. Read only `PROJECT.md` (`## Architecture`, `## Structure`, `## Verify`, your milestone) and `AGENTS.md` if present.
Invoke the `lean-code` and `kotlin` skills before writing code.

## Branch
Base: `master` if it exists, else `main`. Branch `m<n>-<slug>` exists: switch to it and resume from `git log <base>..HEAD`. Else create it from base.

## M0 Scaffold
- Gradle Kotlin DSL project with wrapper (`gradle wrapper` if `gradle` is on PATH), version catalog, Compose, Material 3 theme, single activity, JUnit, Compose UI test, lint.
- `.gitignore` for Gradle, Android Studio, `local.properties`, build outputs.
- One passing unit test, app launches to an empty screen.
- Run the `project-context` skill to write `AGENTS.md`.

## Slices
For each open slice of the milestone, in order:
1. Red: one failing test for the behavior. Run it, see it fail for the right reason.
2. Green: the least code to pass, in the slice's domain folder.
3. Refactor while green.
4. Tick the slice in `PROJECT.md` and commit both: `feat(<domain>): <behavior>`.

Run a single test class with `./gradlew testDebugUnitTest --tests '<Class>'`. Compose UI tests need a device: `./gradlew connectedDebugAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=<Class>`.

## Finish
1. Run `## Verify` all. Red: fix, at most 2 attempts, else `BLOCKED: <failing check and log tail>`.
2. Device check with the `android-device` skill (start an emulator with `-no-window` if none runs): install, launch, walk the milestone's flow, screenshot each new screen to `.git/app-shots/m<n>-<screen>.png`, look at every screenshot, and check `adb logcat -d -b crash` is empty. Bug found: add a failing test and fix it as a slice. Stop the emulator you started.
3. Commit anything left. Clean tree.

## Fix findings
Given review findings: fix each through red, green, refactor on the same branch, re-run Verify, commit `fix(<domain>): <finding>`.

Return `DONE <branch>` plus proof lines: verify result, test count, screenshot paths. Or `BLOCKED: <reason>`.
