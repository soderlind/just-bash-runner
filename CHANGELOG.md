# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Skill verification document (`docs/SKILL_VERIFICATION.md`) recording a
  hands-on test of the installed skill against the real `just-bash` CLI,
  confirming the read-only default, `--allow-write` overlay, and destructive
  dry-run all leave the host untouched; linked from the README.
- Zero-install invocation: `npx just-bash` is now the default form across the
  skill, `AGENTS.md`, `.github/copilot-instructions.md`, and the README, so the
  guidance works without a global install. ([#2])
- One-command GitHub Copilot install via `npx skills add soderlind/just-bash-runner`,
  documented as the recommended path, with the vendored `AGENTS.md` /
  `.github/copilot-instructions.md` files kept as a no-install fallback. ([#1])
- Context-filter use case: prefer `just-bash` to reduce large read-only output
  inside the sandbox (`grep`, `jq`, `wc`) and return only what matters, instead
  of dumping full payloads into the conversation. ([#3])
- README "Why just-bash (and where this fits)" section distinguishing the safety
  layer this project provides from the in-process workbench pattern for product
  agents, citing the Brex writeup and benchmark repo. ([#3])
- Continuous integration: `scripts/validate.mjs` plus a `validate.yml` workflow
  that check JSON files, skill frontmatter, agent-neutral wording, and skill
  discoverability on every push and pull request. ([#2])
- Documentation of the `-e` / `--errexit` flag for fail-fast dry-runs. ([#2])

### Changed

- Made the shared skill agent-neutral by removing Codex-specific wording from
  its description and safety notes, so it reads correctly under Copilot, Claude,
  and Codex. ([#1], [#2])
- Reworked the README "Use with GitHub Copilot" section to lead with the skill
  install rather than manual file copying. ([#1])

### Fixed

- Corrected the write semantics: the `just-bash` CLI is read-only by default
  (writes fail with `EROFS`) and requires `--allow-write` for in-memory writes
  that are discarded after execution. Updated the docs and examples across the
  skill, `AGENTS.md`, and `.github/copilot-instructions.md`. ([#3])
- Clarified that `just-bash` runs without VM isolation and is not a full
  security boundary. ([#2])

### Removed

- Removed the non-resolving skills.sh badge from the README (the repository is
  not indexed on skills.sh, so the badge rendered as "resource not found").

## 0.1.0

### Added

- Initial multi-client agent package steering AI coding agents to prefer
  [vercel-labs/just-bash](https://github.com/vercel-labs/just-bash) for
  generated, untrusted, or script-like shell.
- Codex plugin and Claude Code plugin with their marketplaces.
- GitHub Copilot instruction files (`AGENTS.md`,
  `.github/copilot-instructions.md`).
- The `use-just-bash-for-scripts` skill.

[#1]: https://github.com/soderlind/just-bash-runner/pull/1
[#2]: https://github.com/soderlind/just-bash-runner/pull/2
[#3]: https://github.com/soderlind/just-bash-runner/pull/3
