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

### Session Close Protocol: "Land the Plane" 🚨

**CRITICAL**: Before ending ANY session, follow this comprehensive protocol to ensure clean handoffs and prevent data loss.

#### Step 1: File Remaining Work
```bash
# Create beads issues for any follow-up work discovered during session
bd create --title="..." --type=task|bug|feature
bd dep add <new-issue> <current-issue>  # If dependent
```

**Principle**: Never let work slip through the cracks. File it now or lose it forever.

#### Step 2: Run Quality Gates
```bash
# Verify changes work as expected (adapt to your project):
# - Test manually in browser if web changes
# - Run build scripts if applicable
# - Check for console errors
# - Verify responsive design if UI changes

# Example quality checks for this project:
# 1. Open index.html in browser
# 2. Test wallet generation flow
# 3. Check browser console for errors
# 4. Test QR code generation
# 5. Verify private key import/export

# If ANY issues found:
bd create --title="Fix: <description>" --type=bug --priority=p0
```

**Principle**: Never commit broken code. File P0 issues for failures, then decide whether to fix now or defer.

#### Step 3: Update Beads Issues
```bash
# Close completed work (be specific with reasons)
bd close <id1> <id2> ... --reason="Implemented feature X with Y approach"

# Update in-progress issues with final notes
bd update <id> --comment="Session end: completed setup, next is implementation"
```

**Principle**: The issue tracker must reflect reality. Future you (or teammates) will thank present you.

#### Step 4: Sync Issue Tracker (CRITICAL - Conflict Resolution)
```bash
# Standard case (no conflicts):
bd sync                     # Syncs .beads/issues.jsonl with remote

# If conflicts occur in .beads/issues.jsonl:
git pull                    # Pull remote changes
# Manually resolve .beads/issues.jsonl conflicts:
#   1. Keep both local and remote changes when possible
#   2. JSONL format: each line is independent JSON object
#   3. Preserve all issue IDs - never delete entries
#   4. When in doubt, prefer remote version for existing issues
git add .beads/issues.jsonl
bd sync                     # Re-sync after manual resolution
```

**Principle**: `.beads/issues.jsonl` is source of truth. Merge conflicts require patience and care. Iterate until clean.

#### Step 5: Clean Up Git State
```bash
# Check for lingering stashes
git stash list              # Should be empty or explicitly documented

# Apply or drop stashes
git stash pop               # or git stash drop

# Verify branch state
git status                  # Should show clean working tree
```

**Principle**: Clean state prevents confusion in next session.

#### Step 6: Commit and Push Everything
```bash
# Final verification
git status                  # Review all changes

# Commit code changes
git add <files>
git commit -m "feat: descriptive message following conventional commits"

# Final beads sync (in case commit created new beads data)
bd sync

# Push to remote
git push

# Verify everything is pushed
git status                  # Should show "up to date with origin/main"
bd sync --status            # Should show "in sync with remote"
```

**Principle**: Work is not done until pushed. Period.

#### Step 7: Document Next Steps
```bash
# Review what's ready for next session
bd ready                    # Show available work

# Leave a clear handoff note on the most relevant issue
bd update <next-issue> --comment="Suggested next: start with <specific file/function>"
```

**Principle**: Make it easy for your future self to resume. Context switching is expensive.

---

### Landing Checklist (Quick Reference)

```
[ ] 1. File remaining work (bd create)
[ ] 2. Run quality gates (manual testing, browser checks)
[ ] 3. File P0 issues for any failures
[ ] 4. Close completed issues (bd close with --reason)
[ ] 5. Update in-progress issues with notes
[ ] 6. bd sync (handle conflicts if needed)
[ ] 7. Clean up git stashes
[ ] 8. git add, commit, push
[ ] 9. bd sync (final)
[ ] 10. Verify: git status & bd sync --status
[ ] 11. Document next steps (bd ready, add comments)
```

**NEVER skip this.** Work is not done until the plane has landed.

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
