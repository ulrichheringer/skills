# Global rules

## Code
- No comments. Ever.
- Simplest, shortest code that works. Nothing speculative.
- Delete before adding. Reuse what exists.
- TDD always: failing test first.
- Use the `lean-code` skill when writing code, if available.

## Context economy
- Grep or glob before reading. Read only the needed range of large files.
- Never re-read a file already in context unless it changed.
- Iterate with the narrowest test; run the full suite once at the end.
- Keep command output short: quiet reporters, `| tail -n 40`, grep for failures. Summarize logs, never paste them whole.
- Don't revisit unrelated earlier parts of the conversation unless asked.
- Don't repeat a review of unchanged code.
- Reply short. Don't recap what the diff already shows.
