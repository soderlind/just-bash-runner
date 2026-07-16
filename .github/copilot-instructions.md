# Copilot Instructions

When Copilot is acting as an agent and wants to run generated, untrusted, copied, or exploratory shell scripts, prefer `just-bash` for a sandboxed dry-run before using the normal shell.

Use `just-bash` first for script-like shell with pipes, redirects, heredocs, loops, conditionals, `xargs`, `find ... -exec`, or broad filesystem effects.

Use the normal shell directly for project tooling that must affect the real repository, including test, lint, build, package-manager, Git inspection, and language-specific verification commands.

Check availability before relying on it:

```bash
command -v just-bash
```

Common forms:

```bash
just-bash -c '<script>' --root <workspace-root> --json
just-bash <script-path> --root <workspace-root> --json
```

Remember that just-bash mounts the project at `/home/user/project`; writes stay in the overlay and are discarded.
