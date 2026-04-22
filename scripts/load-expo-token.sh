#!/usr/bin/env bash
# Load EXPO_TOKEN from .env.local (bash).
#
# From bash:
#   source scripts/load-expo-token.sh
#
# From zsh (or bash), load into the **current** shell:
#   eval "$(node scripts/print-expo-token-export.mjs --quiet)"
#
# Printing the export line alone does not set env vars — you must eval it.
#
# One-shot verify (subshell):
#   bash scripts/load-expo-token.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: missing $ENV_FILE" >&2
  exit 1
fi

line="$(grep -E '^[[:space:]]*EXPO_TOKEN=' "$ENV_FILE" | head -n1 | tr -d '\r')"
if [[ -z "$line" ]]; then
  echo "error: EXPO_TOKEN= not found in .env.local" >&2
  exit 1
fi

value="$(printf '%s' "$line" | sed -E 's/^[[:space:]]*EXPO_TOKEN=//')"
if [[ "$value" == \"*\" ]]; then
  value="${value#\"}"
  value="${value%\"}"
elif [[ "$value" == \'*\' ]]; then
  value="${value#\'}"
  value="${value%\'}"
fi

export EXPO_TOKEN="$value"

if [[ -z "$EXPO_TOKEN" ]]; then
  echo "error: EXPO_TOKEN is empty after parsing" >&2
  exit 1
fi

echo "EXPO_TOKEN loaded (${#EXPO_TOKEN} characters)."

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  eas whoami
else
  echo "Run: eas whoami   (or any eas / expo command) in this shell."
fi
