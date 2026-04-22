/**
 * Reads EXPO_TOKEN from .env.local and prints a shell-safe `export` line on stdout.
 *
 * Load into your **current** zsh/bash session (required — printing alone does nothing):
 *   eval "$(node scripts/print-expo-token-export.mjs)"
 *
 * One-shot verify without touching your shell:
 *   npm run expo:whoami
 *
 * CI / scripts (stdout only, no hint on stderr):
 *   node scripts/print-expo-token-export.mjs --quiet
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const quiet = process.argv.includes("--quiet");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

if (!fs.existsSync(envPath)) {
  console.error(`error: missing ${envPath}`);
  process.exit(1);
}

const text = fs.readFileSync(envPath, "utf8");
const line = text.split(/\r?\n/).find((l) => /^\s*EXPO_TOKEN=/.test(l));

if (!line) {
  console.error("error: EXPO_TOKEN= not found in .env.local");
  process.exit(1);
}

let value = line.replace(/^\s*EXPO_TOKEN=/, "").trimEnd();
if (
  (value.startsWith('"') && value.endsWith('"')) ||
  (value.startsWith("'") && value.endsWith("'"))
) {
  value = value.slice(1, -1);
}

if (!value) {
  console.error("error: EXPO_TOKEN is empty");
  process.exit(1);
}

if (!quiet) {
  process.stderr.write(
    "Expo: printing export line on stdout.\n" +
      "To set EXPO_TOKEN in this shell, run:\n" +
      '  eval "$(node scripts/print-expo-token-export.mjs --quiet)"\n' +
      "Or verify in one shot:\n" +
      "  npm run expo:whoami\n\n",
  );
}

process.stdout.write(`export EXPO_TOKEN=${JSON.stringify(value)}\n`);
