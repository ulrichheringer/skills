---
name: pr-loop
description: Resolve review comments and failing CI on your PR - triage, fix, reply, resolve threads. Use for /pr-loop <number>.
disable-model-invocation: true
argument-hint: "<pr number>"
---

# PR loop

Comments already exist when this runs. Never merge. Max 3 rounds.

## 1. Collect
Unresolved threads:
```bash
gh api graphql -F owner='{owner}' -F repo='{repo}' -F pr=<n> -f query='
query($owner:String!,$repo:String!,$pr:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$pr){
reviewThreads(first:100){nodes{id isResolved path line comments(first:10){nodes{author{login} body}}}}}}}' \
--jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved | not)'
```
Review bodies: `gh pr view <n> --json reviews -q '.reviews[].body'`.
CI: `gh pr checks <n>`. For a failing run read only `gh run view <id> --log-failed | tail -n 60`.

## 2. Triage each item on merit
- fix: real bug, missing test, spec violation, clear simplification.
- dismiss: nit, preference, speculation, conflicts with the spec or `lean-code`. Give a concrete reason.
- ask: a product call only the user can make. Batch these into one question.

## 3. Fix
Test first for behavior bugs, per `tdd`. One commit per fix: `fix: <what>`. Run the full suite, typecheck, lint. Push.

## 4. Reply and resolve
```bash
gh api graphql -f id=<thread> -f body='<reply>' -f query='mutation($id:ID!,$body:String!){addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$id,body:$body}){comment{id}}}'
gh api graphql -f id=<thread> -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{isResolved}}}'
```
Reply: `Fixed in <sha>: <what>.` or `Not changing: <reason>.` Leave ask threads open.

## 5. Next round
Only if CI fails after the push: back to 1. Don't wait for a new review.

Report: fixed, dismissed with reasons, open questions, CI state.
