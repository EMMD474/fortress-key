# Makefile — git branch sync helpers for Fortress Key
#
# Usage:
#   make sync-emmd     # update emmd, update main, then merge main into emmd

# Branch names (override on the command line, e.g. `make sync-emmd FEATURE=my-branch`)
FEATURE ?= emmd
BASE    ?= main

.PHONY: sync-emmd

## Update the feature branch, update the base branch, then merge base -> feature.
## Runs as a single recipe so it stops immediately if any step fails.
sync-emmd:
	@echo ">> Updating $(FEATURE)..."
	git checkout $(FEATURE)
	git pull origin $(FEATURE)
	@echo ">> Switching to $(BASE) and updating..."
	git checkout $(BASE)
	git pull origin $(BASE)
	@echo ">> Switching back to $(FEATURE) and merging $(BASE)..."
	git checkout $(FEATURE)
	git merge $(BASE)
	@echo ">> Done. $(BASE) merged into $(FEATURE)."
