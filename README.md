# Just Bash Runner

Codex plugin that steers agents to prefer [vercel-labs/just-bash](https://github.com/vercel-labs/just-bash) when running generated, untrusted, or script-like shell snippets.

The plugin adds a workflow skill, not a hard runtime override. It tells Codex to dry-run suitable scripts with `just-bash` first, then use the normal shell only when real project tooling or real filesystem changes are required.

## Install

Add this Git marketplace:

```bash
codex plugin marketplace add soderlind/just-bash-runner --ref main
```

Install the plugin from that marketplace:

```bash
codex plugin add just-bash-runner@just-bash-runner
```

Start a new Codex thread after installing so the new skill is loaded.

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
.agents/plugins/marketplace.json
plugins/just-bash-runner/.codex-plugin/plugin.json
plugins/just-bash-runner/skills/use-just-bash-for-scripts/SKILL.md
```
