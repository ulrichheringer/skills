---
name: review-pr
description: Review someone else's GitHub PR and post findings as one review. Use for /review-pr <number>.
disable-model-invocation: true
argument-hint: "<pr number | url>"
---

# Review PR

1. Load: `gh pr view <n> --json title,body,files,comments,reviews` and `gh pr diff <n>`. Read the linked issue if any.
2. Skip lockfiles, generated files, snapshots.
3. Review in the same order as `/review`: correctness, spec fit, tests, simplicity, rules.
4. Don't repeat points already raised in existing comments.
5. Show findings: `path:line: [high|med|low] <problem>. <fix>.`
6. Ask before posting. On yes, write `review.json`:
   ```json
   {"event": "COMMENT", "body": "<one-line summary>",
    "comments": [{"path": "src/x.ts", "line": 42, "side": "RIGHT", "body": "<problem>. <fix>."}]}
   ```
   Post: `gh api repos/{owner}/{repo}/pulls/<n>/reviews --input review.json`.

Never approve or request changes unless asked.
