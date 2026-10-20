# Branches and releases

All VOID and DESERT development happens on branches. No direct incremental
development pushes to VOID `main`: each accepted push to `main` is intended to
start a new version of the product.

## One version across surfaces

The target release contains iOS, Android and Linux binaries plus a Web build from
the same product revision and exact DESERT dependency. Web is a deployable build,
not a native executable. All four share the same version and applicable journey
semantics, authority, validation, outcomes and recovery.

Platform-native geometry and interaction mechanisms can differ. The same action
cannot mean something different on another platform, and unavailable capabilities
cannot silently disappear or be replaced with handwritten product behavior.

## Required pipeline

1. Branch checks verify closed declarations, ownership boundaries, independent
   journey cases and the exact SDK dependency.
2. Review establishes the release candidate; only accepted work enters `main`.
3. A main push allocates its version once and builds all four targets from that
   exact revision. Retrying the same pipeline resumes that candidate.
4. Qualify the applicable journeys on each target, including denial, recovery,
   invalid input and interrupted execution. Compilation alone is insufficient.
5. Publish a complete release only when all required targets pass. A failed target
   leaves the version candidate failed/pending, not a misleading partial release.
6. Record source/SDK revisions, checksums, qualification evidence and changelog.

Code signing, provisioning, distribution channels and secrets belong in trusted
release infrastructure. They are not product declarations or repository fixtures.
App Store review/public availability is separate from producing a signed build;
cross-store publication cannot be promised atomic.

## Current bootstrap

This policy is recorded, not an installed pipeline. The first branch is
`codex/notes-foundation`; no push to `main`, release tag, store submission, cloud
deployment or native binary is part of the N0 proof.

DESERT currently installs a Svelte web renderer. iOS, Android and Linux delivery
need explicit renderer/host/build decisions and qualification. An agent-surface
descriptor is not an MCP server, and a workflow file is not a working native build.

Before enabling `main`, provide a public licensed SDK distribution, reproducible
dependency pinning, all required build/test jobs, release credentials and branch
protection. Do not add jobs that print success for missing targets.
