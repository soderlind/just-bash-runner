#!/usr/bin/env node
// Validates the just-bash-runner package: JSON files parse, the skill has the
// required frontmatter, and the shared skill stays agent-neutral. Run with
// `node scripts/validate.mjs` (also runs in CI).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const rel = (p) => fileURLToPath(new URL(p, root));
const errors = [];

// 1. Every packaged JSON file must parse.
const jsonFiles = [
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "plugins/just-bash-runner/.codex-plugin/plugin.json",
  "plugins/just-bash-runner/.claude-plugin/plugin.json",
];
for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(rel(file), "utf8"));
  } catch (err) {
    errors.push(`Invalid JSON in ${file}: ${err.message}`);
  }
}

// 2. The skill must have name + description frontmatter, and the name must
//    match its directory.
const skillPath =
  "plugins/just-bash-runner/skills/use-just-bash-for-scripts/SKILL.md";
const skill = readFileSync(rel(skillPath), "utf8");
const fm = skill.match(/^---\n([\s\S]*?)\n---/);
if (!fm) {
  errors.push(`${skillPath}: missing frontmatter block`);
} else {
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== "use-just-bash-for-scripts") {
    errors.push(
      `${skillPath}: frontmatter name must be "use-just-bash-for-scripts", got "${name}"`,
    );
  }
  if (!description || description.length < 40) {
    errors.push(`${skillPath}: frontmatter description missing or too short`);
  }
}

// 3. The shared skill must stay agent-neutral (guards the earlier "Codex" leak).
if (/\bCodex\b/.test(skill)) {
  errors.push(
    `${skillPath}: shared skill should not name a specific agent (found "Codex")`,
  );
}

if (errors.length) {
  console.error("Validation failed:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `OK: ${jsonFiles.length} JSON file(s) parsed, skill frontmatter valid, skill is agent-neutral.`,
);
