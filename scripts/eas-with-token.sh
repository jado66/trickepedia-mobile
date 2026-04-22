#!/usr/bin/env bash
# Run eas with EXPO_TOKEN loaded from .env.local (same process as eas).
#
#   ./scripts/eas-with-token.sh whoami
#   npm run eas -- whoami
#   npm run eas -- build --profile production --platform android
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
eval "$(node "$ROOT/scripts/print-expo-token-export.mjs" --quiet)"
exec eas "$@"
