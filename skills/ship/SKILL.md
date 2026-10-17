---
name: ship
description: Verify, commit, push, and open a PR with a before/after block against main. Use for /ship.
disable-model-invocation: true
argument-hint: "[#issue]"
---

# Ship

## 1. Verify
Run test, typecheck, lint (from `CLAUDE.md` or the spec's Verify). Any failure: stop and report.

## 2. Commit
On main: branch first. Stage only this change's files. Conventional commit, subject ≤ 50 chars, body only for a non-obvious why.

## 3. Before/after
Compare `main` and `HEAD` for the behavior that changed. Run the base in `git worktree add /tmp/base-<slug> main`; remove it after.
- UI changed: capture the same page, state, and viewport on both with agent-browser (`agent-browser skills get core --full`) into `captures/<name>-before.png` and `-after.png`. New screen: after only. Add `captures/` to `.git/info/exclude`.
- No UI: real output from both versions as text: command output, API response, signature, error message. Never invented.

## 4. PR
Body:
```markdown
<1-3 sentences: what and why>

Closes #<issue>

<!-- before-and-after:start -->
### Before
<text evidence>
### After
<text evidence>
<!-- before-and-after:end -->

## Tests
- <what proves it>
```
`git push -u origin HEAD`, then `gh pr create --title "<commit subject>" --body-file <tmp>`.

Images: create the PR with the two marker lines and nothing between them, then fill the block:
```bash
gh pr view <n> --json body -q .body > /tmp/body.md
node <skill-dir>/scripts/format.mjs --body-file /tmp/body.md --before <b.png> --after <a.png> [--label <L>] > /tmp/next.md
gh pr edit <n> --body-file /tmp/next.md $(node <skill-dir>/scripts/format.mjs --attach-list --before <b.png> --after <a.png> | sed 's/^/--attach /')
```
Confirm no `captures/` path remains in the PR body. Re-runs replace only the marked block.

## 5. Issue
If linked, tick every slice once:
`gh issue view <n> --json body -q .body | sed 's/- \[ \]/- [x]/' > /tmp/issue.md && gh issue edit <n> --body-file /tmp/issue.md`

Report the PR URL. Never merge.

Formatter adapted from vercel-labs/before-and-after, see `LICENSE.before-and-after`.
