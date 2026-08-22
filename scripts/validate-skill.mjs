import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const skill = readFileSync(new URL("../SKILL.md", import.meta.url), "utf8");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);

assert(frontmatter, "SKILL.md must start with YAML frontmatter");
assert.match(frontmatter[1], /^name:\s*sleak\s*$/m, "skill name must be sleak");
assert.match(frontmatter[1], /^description:\s*>-/m, "skill description is required");
assert.match(skill, /\[checklist\]\(checklist\.md\)/, "SKILL.md must link to checklist.md");

console.log("Sleak skill bundle is valid.");
