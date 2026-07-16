# Just Bash Runner

Multi-client agent package that steers AI coding agents to prefer [vercel-labs/just-bash](https://github.com/vercel-labs/just-bash) when running generated, untrusted, or script-like shell snippets.

It adds workflow guidance, not a hard runtime override. It tells compatible agents to dry-run suitable scripts with `just-bash` first, then use the normal shell only when real project tooling or real filesystem changes are required.

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

Copilot does not install Codex or Claude plugins directly. This repo includes two instruction files Copilot can use:

- `AGENTS.md`
- `.github/copilot-instructions.md`

Copy or keep those files in a repository where you want Copilot's agent behavior to prefer `just-bash` for generated or untrusted shell scripts.

## just-bash CLI

The plugin expects the `just-bash` CLI to be available before relying on it:

```bash
command -v just-bash
```

Install `just-bash` separately if needed:

```bash
npm install -g just-bash
```

## Behavior

The skill prefers `just-bash` for:

- agent-authored shell scripts
- user-provided snippets that should be inspected first
- command chains with pipes, redirects, loops, conditionals, or broad filesystem effects
- dry-runs before potentially destructive shell operations

It keeps normal shell execution for project tooling that must touch the real repo, such as test, lint, build, and language-specific verification commands.

## Repository Layout

```text
.claude-plugin/marketplace.json
.agents/plugins/marketplace.json
AGENTS.md
.github/copilot-instructions.md
plugins/just-bash-runner/.codex-plugin/plugin.json
plugins/just-bash-runner/.claude-plugin/plugin.json
plugins/just-bash-runner/skills/use-just-bash-for-scripts/SKILL.md
```
