# Recoverable Notes removal

Implemented product decisions under the owner's overnight implementation mandate.

- Removal means **Move to Trash**, never a physical delete. Restore returns the
  same object, content and owner to active Notes. No expiry or automatic purge.
- The Notes toolbar opens Trash. Trash is a registered child destination with a
  Back to Notes action, not another top-level sidebar entry.
- Active notes publish Edit and Move to Trash. Trashed notes publish Restore.
  The shared source-read binding selects these actions; the controller remains
  authoritative about eligibility and connection availability.
- Move to Trash requires the existing explicit review and exact prepared-effect
  acceptance. Restore uses explicit invocation without a second review because it
  is reversible and does not replace content. Both produce durable receipts.
- Edit is permitted only while active. Stale prepared transitions fail. A read
  predicate is evaluated by the controller for collection and direct-object reads,
  not filtered privately in the renderer.
- The active detail remains title and content. Trash detail also publishes Status,
  allowing the review to show the changing fact without weakening the SDK's
  preparation-response projection. Ownership is never published.
- No labels, participation, collaborative merging or history interface is claimed
  by this increment. Their required contracts remain distinct from a lifecycle
  transition and are not represented as comma-separated text or local UI state.

## Verification

`tests/notes-trash.test.ts` exercises real PostgreSQL, human/agent sessions, owner
isolation, exact receipts, restart persistence, rejected stale transitions and
preservation of identity/content. `tests/web/notes-trash.test.ts` targets the actual
built application at 390px and 1600px; record its executed result in VERIFICATION.md.
The generic SDK read-predicate and filtered-detail tests cover the shared behavior.
