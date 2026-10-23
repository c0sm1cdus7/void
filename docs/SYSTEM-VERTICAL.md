# System vertical

The System module declares one presentation journey and one View. Its only
content composition is the SDK-owned `Components.SystemStatus()`; products cannot
supply connection states, counters, styles, runtime callbacks or alternate geometry.

The SDK resolves it into existing Stack/Fact/Text pieces from two actual sources:

- The compiled human surface supplies exposed operation labels, dependencies,
  product/surface identifiers, interaction protocol, catalog version and contract digest.
- The current availability observation supplies readiness and blocker reasons.
  Unknown, stale, incompatible, unreachable, unauthenticated and stopped observations
  remain distinct. Registration alone is not a successful connection.

An available dependency is not authorization, valid input, or proof that a future
operation will succeed. Per-object command offers and controller admission retain
their existing authority. System does not run reads, commands or identity actions.

No current identity label or build digest is published by the existing browser
contract, so neither is invented or obtained from credentials. The displayed
contract digest is explicitly a contract digest, not a build version or attestation.

`desert/tests/system-status.test.ts` checks closed construction and data projection,
including missing/mismatched/expired evidence. `tests/web/system.test.ts` verifies
the actual browser updates after the temporary controller closes and admits no
operations. Device and native renderer behavior remain separate verification.
