#!/usr/bin/env sh
set -eu
root=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$HOME/.claude/skills" "$HOME/.claude/agents"
for d in "$root"/skills/*/; do
  ln -sfn "${d%/}" "$HOME/.claude/skills/$(basename "$d")"
done
for f in "$root"/agents/*.md; do
  ln -sfn "$f" "$HOME/.claude/agents/$(basename "$f")"
done
echo "Linked skills and agents into $HOME/.claude"
