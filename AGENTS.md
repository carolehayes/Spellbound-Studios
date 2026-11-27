# Spellbound-Studios — Agent instructions

## Autonomous milestone workflow

When Carole requests ongoing implementation, continue autonomously through successive milestones: build, verify, fix, document, and begin the next task. Use progress updates without ending the session. Stop only for a genuine blocker, necessary decision, or completion. Keep private data and unpublished beta imagery out of public assets; document blockers and continue independent tasks where possible.


## Shared session continuity

At session start, before substantial work, read `README.md` (if present), `AGENTS.md`, and `SESSION-HANDOFF.md`, plus `CLAUDE.md` and relevant project instructions. Inspect the current branch, Git status, recent commits and open pull requests; preserve uncommitted work, generated marker blocks, architecture decisions and agent-specific procedures. Recheck the remote head before publishing changes; do not overwrite concurrent work.

After substantial work, automatically update `SESSION-HANDOFF.md` without waiting for a reminder: date/time zone, assistant, changes and files/commits, tests and actual results (including not run), decisions, blockers, and the exact next step. Distinguish source implementation, historical verification and current runtime verification. Keep it concise and link to existing detailed records; do not create a competing assistant-specific progress log. Preserve existing history and required project workflows. Commit the handoff with the work when appropriate; accurately report whether it is local, committed, pushed or awaiting review. If writes are unavailable, provide the exact proposed update instead of claiming it was saved.
