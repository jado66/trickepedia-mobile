/**
 * Reads EXPO_TOKEN from .env.local and prints a shell-safe `export` line.
 * Usage (bash or zsh):
 *   eval "$(node scripts/print-expo-token-export.mjs)"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// JSON.stringify so eval is safe even if token contains quotes or $
process.stdout.write(`export EXPO_TOKEN=${JSON.stringify(value)}\n`);
