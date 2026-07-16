# Copilot Instructions

When Copilot is acting as an agent and wants to run generated, untrusted, copied, or exploratory shell scripts, prefer `just-bash` for a sandboxed dry-run before using the normal shell.

Use `just-bash` first for script-like shell with pipes, redirects, heredocs, loops, conditionals, `xargs`, `find ... -exec`, or broad filesystem effects.

Use the normal shell directly for project tooling that must affect the real repository, including test, lint, build, package-manager, Git inspection, and language-specific verification commands.

Run it with no install step via `npx` (or drop the prefix when it is installed globally):

```bash
npx just-bash -c 'echo ready' --json
```

Common forms:

```bash
npx just-bash -c '<script>' --root <workspace-root> --json
npx just-bash <script-path> --root <workspace-root> --json
```

Add `-e` (`--errexit`) when the script should stop at the first failing command. The sandbox is read-only by default; add `--allow-write` for scripts that create, edit, or delete files. For an always-available binary, install it globally with `npm install -g just-bash`.

Remember that just-bash mounts the project at `/home/user/project` and is read-only by default (writes fail with `EROFS`). With `--allow-write`, writes stay in an in-memory overlay and are discarded, so the host is never modified. It runs without VM isolation, so it is not a full security boundary.
