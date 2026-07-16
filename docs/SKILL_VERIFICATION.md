# Skill Verification

This document records a hands-on verification of the `use-just-bash-for-scripts`
skill after installing it into a GitHub Copilot agent with
`npx skills add soderlind/just-bash-runner`.

Each documented behavior in
[`SKILL.md`](../plugins/just-bash-runner/skills/use-just-bash-for-scripts/SKILL.md)
was exercised against the real `just-bash` CLI. The goal was to confirm that the
skill's central promise — **agent-authored or destructive shell can be dry-run
with no side effects on the host** — actually holds.

## Environment

| Item | Value |
| --- | --- |
| Skill install | `npx skills add soderlind/just-bash-runner` (auto-detected GitHub Copilot) |
| Skill location | `~/.agents/skills/use-just-bash-for-scripts/SKILL.md` |
| `just-bash` package | `just-bash` (npm), CLI self-reports `1.0.0` |
| Invocation paths | global binary and `npx just-bash` (zero-install) |
| Sandbox root | a real project checkout mounted read-only |
| Date | 2026-07-16 |

## Results

All checks passed. Output shown below is the CLI's `--json` result.

| # | Behavior under test | Command (abridged) | Expected | Result |
| --- | --- | --- | --- | --- |
| 1 | Availability (global + npx) | `just-bash -c 'echo ready' --json` / `npx just-bash ...` | runs, JSON out | ✅ `{"stdout":"ready\n",...,"exitCode":0}` |
| 2 | Read-only context filter (no flag) | `just-bash -c 'ls \| head -5; grep -rIl just-bash .' --root <root>` | reads real files | ✅ listed real repo files |
| 3 | **Read-only by default** | `just-bash -c 'echo hacked > PROOF.txt' --root <root>` | write blocked | ✅ `EROFS: read-only file system`, `exitCode:1`; no host file created |
| 4 | `--allow-write` overlay | `just-bash -c 'echo hi > PROOF.txt; cat PROOF.txt' --allow-write` | succeeds in sandbox, discarded on host | ✅ readable in sandbox; **host file never appeared** |
| 5 | `-e` / `--errexit` | `just-bash -e -c 'echo one; false; echo nope'` | stops at first failure | ✅ printed `one`, `exitCode:1`, `nope` not printed |
| 6 | `jq` available | `just-bash -c 'cat composer.json \| jq -r .name'` | parses JSON | ✅ returned the package name |
| 7 | Destructive dry-run | `printf 'find . -name "*.md" -delete' \| just-bash --allow-write` | "deletes" in sandbox only | ✅ reported deletion; **real `README.md` still present on host** |
| 8 | Scratch-file fetch-and-filter (one invocation) | `just-bash -c 'find . -name "*.json" > files.txt; wc -l < files.txt; head -3 files.txt' --allow-write` | write + read in same run | ✅ wrote and read `files.txt` inside the sandbox |

## Key finding

The core safety guarantee held in all three write scenarios:

1. A plain write was **blocked** (`EROFS`) under the read-only default.
2. A write with `--allow-write` **succeeded inside the sandbox but left the host untouched**.
3. A simulated `find ... -delete` "removed" files in the sandbox while the real
   files remained on disk.

In other words, an agent following this skill can preview generated or
potentially destructive shell without risking the real working tree.

## Reproduce

Run any of the commands above against a project checkout, for example:

```bash
# read-only default: this write is blocked
npx just-bash -c 'echo hacked > PROOF.txt' --root "$(pwd)" --json

# allow-write: succeeds in the overlay, discarded afterwards — host unchanged
npx just-bash -c 'echo hi > PROOF.txt; cat PROOF.txt' --root "$(pwd)" --allow-write --json
ls PROOF.txt   # -> No such file or directory on the host
```

## Caveats

Consistent with the skill's own Safety Notes, this verification does **not**
claim `just-bash` is a hardened security boundary. It runs without VM isolation
and network access is disabled by default. It reduces host side effects for
suitable shell scripts; it does not replace the agent's own sandboxing,
approvals, dependency review, or user confirmation for destructive work.
