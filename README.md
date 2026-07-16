# Just Bash Runner

Multi-client agent package that steers AI coding agents to prefer [vercel-labs/just-bash](https://github.com/vercel-labs/just-bash) when running generated, untrusted, or script-like shell snippets.

It adds workflow guidance, not a hard runtime override. It tells compatible agents to dry-run suitable scripts with `just-bash` first, then use the normal shell only when real project tooling or real filesystem changes are required.

**Quick install**: [Codex](#install-for-codex) · [Claude Code](#install-for-claude-code) · [GitHub Copilot](#use-with-github-copilot)

## Install for Codex

Add this Git marketplace:

```bash
codex plugin marketplace add soderlind/just-bash-runner --ref main
```

Install the plugin from that marketplace:

```bash
codex plugin add just-bash-runner@just-bash-runner
```

Start a new Codex thread after installing so the new skill is loaded.

## Install for Claude Code

In Claude Code, add this Git marketplace:

```text
/plugin marketplace add soderlind/just-bash-runner
```

Install the plugin from that marketplace:

```text
/plugin install just-bash-runner@just-bash-runner
```

Reload plugins or start a fresh Claude Code session:

```text
/reload-plugins
```

You can also test the plugin directly from a clone:

```bash
claude --plugin-dir ./plugins/just-bash-runner
```

## Use with GitHub Copilot

GitHub Copilot CLI loads skills in the same `SKILL.md` format this repo already ships, so you get a real one-command install — no manual file copying.

### Install as a skill (recommended)

Install straight from this repo with the cross-agent [`skills`](https://skills.sh) CLI. It auto-detects Copilot and installs the `use-just-bash-for-scripts` skill:

```bash
npx skills add soderlind/just-bash-runner
```

Add `--global` to install it for your user across all projects, or omit it to install into the current project (`.agents/skills/`). Start a fresh Copilot session so the skill is picked up. Copilot then loads the skill on demand when a task involves running generated or untrusted scripts, instead of carrying the guidance in every prompt.

### No-install alternative (vendored instructions)

If you prefer not to install a skill, this repo also ships two always-on instruction files Copilot reads directly from a repository:

- `AGENTS.md`
- `.github/copilot-instructions.md`

Copy either (or both) into a repository where you want Copilot's agent behavior to prefer `just-bash` for generated or untrusted shell scripts.

## just-bash CLI

The plugin relies on the `just-bash` CLI. It needs no install step — agents can invoke it with `npx`:

```bash
npx just-bash -c 'echo ready' --json
```

For an always-available binary, install it globally instead:

```bash
command -v just-bash || npm install -g just-bash
```

## Behavior

The skill prefers `just-bash` for:

- agent-authored shell scripts
- user-provided snippets that should be inspected first
- command chains with pipes, redirects, loops, conditionals, or broad filesystem effects
- dry-runs before potentially destructive shell operations
- read-only exploration whose raw output would otherwise flood the conversation — reduce it in the sandbox (`grep`, `jq`, `head`, `wc`) and return only what matters

It keeps normal shell execution for project tooling that must touch the real repo, such as test, lint, build, and language-specific verification commands.

## Why just-bash (and where this fits)

`just-bash` ([vercel-labs/just-bash](https://github.com/vercel-labs/just-bash)) is a bash-like interpreter with a virtual, overlay filesystem. There are two distinct ways to adopt it, and this project targets only the first:

- **Safety layer for coding agents (this project).** Steer agents such as GitHub Copilot, Codex, and Claude Code to dry-run generated or untrusted shell in the sandbox before touching the real host. Delivered as a workflow skill plus agent instructions — no code changes to your app.
- **Workbench layer for product agents.** Embed the `just-bash` *library* directly in an application agent so it can keep raw artifacts out of the model context, reduce them, and return a small decision packet. Brex describes this pattern — moving one audit agent to a `just-bash` workbench cut P90 token usage from ~3M to ~600–700k and roughly halved P95 latency ([post](https://x.com/brexHQ/status/2077063945085415655), [benchmark repo](https://github.com/herculesggimenes/bash-sandbox-benchmarks)).

Both use the same tool for different goals. This project is the safety layer: it steers agents toward the `just-bash` CLI as a one-shot sandbox. It does **not** provide the persistent, in-process workbench from the product-agent pattern — CLI runs are isolated and their overlay writes are discarded after each invocation. If you want the workbench behavior (files as memory, state carried across steps), embed the `just-bash` library in your own agent loop instead.

## Repository Layout

```text
.claude-plugin/marketplace.json
.agents/plugins/marketplace.json
.github/copilot-instructions.md
.github/workflows/validate.yml
AGENTS.md
CHANGELOG.md
scripts/validate.mjs
plugins/just-bash-runner/.codex-plugin/plugin.json
plugins/just-bash-runner/.claude-plugin/plugin.json
plugins/just-bash-runner/skills/use-just-bash-for-scripts/SKILL.md
```
