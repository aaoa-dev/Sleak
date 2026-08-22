#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const SOURCE = "aaoa-dev/Sleak";
const SKILL = "sleak";
const require = createRequire(import.meta.url);
const skillsPackage = require.resolve("skills/package.json");
const skillsCli = join(dirname(skillsPackage), "bin", "cli.mjs");

const [command, ...args] = process.argv.slice(2);

function help() {
  console.log(`sleak — install the Sleak design-decision skill

Usage:
  sleak install [skills options]   Install Sleak (default command)
  sleak list                      Check that the skill is discoverable
  sleak use [skills options]       Use Sleak without installing it
  sleak --help                    Show this help

Examples:
  sleak install
  sleak install --global --agent codex
  sleak install --global --agent claude-code --yes
  sleak use --agent codex

Options after the command are passed to the skills CLI.`);
}

if (command === "--help" || command === "-h" || command === "help") {
  help();
  process.exit(0);
}

let forwarded;
if (!command || command === "install" || command === "add") {
  forwarded = ["add", SOURCE, "--skill", SKILL, ...args];
} else if (command === "list") {
  forwarded = ["add", SOURCE, "--list", ...args];
} else if (command === "use") {
  forwarded = ["use", SOURCE, "--skill", SKILL, ...args];
} else {
  console.error(`Unknown command: ${command}\n`);
  help();
  process.exit(1);
}

const result = spawnSync(process.execPath, [skillsCli, ...forwarded], {
  stdio: "inherit"
});

if (result.error) {
  console.error(`Could not start the skills installer: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
