import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../bin/sleak.mjs", import.meta.url));

test("prints focused install help", () => {
  const output = execFileSync(process.execPath, [cli, "--help"], {
    encoding: "utf8"
  });

  assert.match(output, /sleak install --global --agent codex/);
  assert.match(output, /Options after the command are passed to the skills CLI/);
});

test("rejects unknown commands", () => {
  const result = spawnSync(process.execPath, [cli, "unknown"], {
    encoding: "utf8"
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command: unknown/);
});
