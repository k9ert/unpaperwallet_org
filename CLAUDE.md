# Claude Code Project Guide - unpaperwallet.org

## Beads Workflow (CRITICAL)

This project uses **Beads** for issue tracking. ALL work must go through beads.

### Core Rules
- 🚨 Track ALL work in beads (no TodoWrite tool, no markdown TODOs)
- Use `bd create` to create issues
- Git workflow: hooks auto-sync, run `bd sync` at session end
- Session management: check `bd ready` for available work

### Essential Commands

**Finding Work:**
```bash
bd ready                    # Show issues ready to work (no blockers)
bd list --status=open       # All open issues
bd show <id>                # Detailed issue view
```

**Working on Issues:**
```bash
bd update <id> --status=in_progress  # Claim work
bd close <id>                        # Mark complete
bd close <id> --reason="..."         # Close with explanation
bd close <id1> <id2> ...             # Close multiple at once
```

**Creating Issues:**
```bash
bd create --title="..." --type=task|bug|feature
```

**Dependencies:**
```bash
bd dep add <issue> <depends-on>  # Add dependency (depends-on blocks issue)
bd blocked                       # Show all blocked issues
```

### Session Close Protocol 🚨

**CRITICAL**: Before ending ANY session, run this checklist:

```bash
[ ] 1. git status              # Check what changed
[ ] 2. git add <files>         # Stage code changes
[ ] 3. bd sync                 # Sync beads changes
[ ] 4. git commit -m "..."     # Commit code
[ ] 5. bd sync                 # Sync any new beads changes
[ ] 6. git push                # Push to remote
```

**NEVER skip this.** Work is not done until pushed.

## Quick Reference

**Get help:**
```bash
bd quickstart  # Full beads reference
/help          # Claude Code help
```

**Common workflow:**
```bash
bd ready                              # Find work
bd show <id>                          # Review details
bd update <id> --status=in_progress   # Claim it
# ... do the work ...
bd close <id> --reason="..."          # Complete it
git add . && git commit -m "..." && git push  # Push it
```

---

*Remember: Beads first, code second. Track everything.*
