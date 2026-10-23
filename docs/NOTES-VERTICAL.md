# Notes first vertical

Notes is VOID's first durable capability and a test of DESERT's shared
view/journey architecture. This document describes the current source as of
2026-10-22, not the contents of every preserved build. Exact build and browser
evidence belongs in [verification](VERIFICATION.md) and the
[current delivery record](OVERNIGHT-2026-10-22.md).

## Installed product behavior

[`notes.module.ts`](../src/modules/notes/notes.module.ts) registers one private
Note object, its ownership policy, an execution role, seven Views and seven
execution journeys: create, read active notes, edit, read Trash, move to Trash
and restore, plus Guided note using the same create command. The module exports references; it supplies no controller class,
renderer, CSS or independent business validator.

- Home and Notes invoke the same creation journey. Create and edit reuse the
  same typed editor, with explicit source-read and edit-initialization bindings.
- A note may have an explicitly empty title. The display fallback is never
  persisted as fabricated content. The schema does not yet model an absent title.
- The detail title comes from Note's publication and occupies the shared top
  toolbar. Its icon actions are Edit, Move to Trash and Restore; source-read,
  controller availability and canonical state guards determine eligibility.
- The editor requests the shared right-side host. Narrow hosts use the shared
  bottom transient presentation. These are SDK geometry/motion rules, not
  product breakpoints or alternate editor implementations.
- Move to Trash is a recoverable state transition, not hard deletion. It requires
  human review. Restore returns the same object, content and identity to the
  active collection. There is no purge, retention timer or automatic cleanup.
- Active and Trash collections use canonical `where` guards. The controller
  filters authorized reads; the renderer does not hide forbidden rows locally.
  State is published for transition review, while ordinary detail reads publish
  only title/body. Ownership remains internal.
- Create/edit, Trash and Restore use the same admission, preparation, atomic
  acceptance and receipt mechanism. Stale edit bases fail; a lost reply recovers
  the original operation rather than creating a replacement write.

The protected local host uses the SDK's first-admin/sign-in/lock boundary.
Explicit developer identities remain isolated test fixtures. Notes are private
to their owner; being the administrator does not authorize reading another
identity's notes.

## Code path

```text
note.object.ts + note.publication.ts
  → commands/*.command.ts         declared effects and state guards
  → journeys/*.journey.ts         execution + typed View bindings
  → views/*.view.ts               Components values, no execution
  → notes.module.ts              registration and public references
  → void.product.ts              composition, workspace, navigation, exposure
  → DESERT                       canonical controller + shared web catalog
```

`surfaces.ts` exposes the same seven Notes execution journeys to human and agent
sessions. DESERT has real HTTP and MCP stdio adapters; this is stronger than the
original N0 in-process exposure proof. It does not imply that VOID installs an
agent OAuth service, that the visual navigator is remotely serializable, or
that a human draft can resume in a different surface/session.

## Independent acceptance and remaining scope

| Requirement | Current evidence or limitation |
| --- | --- |
| Empty title, exact content, malformed input rejection | Product runtime cases in [`notes-inputs.test.ts`](../tests/notes-inputs.test.ts). |
| Ownership and minimal read projection | [`notes-authority.test.ts`](../tests/notes-authority.test.ts); a guessed ID grants no access. |
| Durable object and receipt after restart | [`notes-persistence.test.ts`](../tests/notes-persistence.test.ts). |
| Reused editor, original version and stale edits | [`notes-editing.test.ts`](../tests/notes-editing.test.ts) and [browser editing cases](../tests/web/notes-editing.test.ts). |
| Guarded Trash/Restore, identity preservation, replay and cross-identity rejection | [`notes-trash.test.ts`](../tests/notes-trash.test.ts) and [browser Trash cases](../tests/web/notes-trash.test.ts). |
| Actual Notes navigation and creation | [Browser Notes cases](../tests/web/notes.test.ts) run against an explicitly selected generated build. |
| Shared HTTP/MCP execution mechanism | SDK adapter tests cover canonical dispatch; product-level remote deployment and OAuth are not qualified by them. |
| Cross-surface draft/activity continuation | Not a completed Notes capability. Conditional activities have their own bounded durable runtime, not automatic persistence of this ordinary editor. |
| Labels, participants and collaboration | Not implemented. Needs typed labels, participation/revocation policy, live content synchronization, conflict/merge semantics and history. |
| Optional/absent title | Not implemented. Present-empty is a supported value, not a substitute for absence. |

Test source is an executable case, not proof that every current artifact passed
it. Consult the delivery record for commands, build identity and actual results.
Neither controller availability polling nor owner-only access is real-time
collaborative editing. No cross-object transaction or shared note permission is
introduced by module composition.

## Delivery safeguards

Use isolated databases for tests. Contract changes must not repin or erase an
existing installation. The owner's explicit 2026-10-21 reset of disposable VOID
data was a one-time authorized action, not a general migration mechanism.
Preserve the approved stable builds, source, reference media and visual bank.
SDK/browser behavior and visual parity need separate evidence; passing schema or
runtime tests alone does not qualify appearance or a complete Notes product.
