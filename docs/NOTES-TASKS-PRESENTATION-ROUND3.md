# Notes and Tasks — bounded presentation refinement

Date: 2026-10-22. This is a source/evidence record, not a deployment or a claim
that the complete historical Notes/Tasks roadmap is implemented.

## Implemented scope

- The real shared Context owner renders multiline body content before its
  properties. Projects and the named Status selector occupy one grouped pane.
- `ContextProperties` and `ObjectStateRow` are finite shared bank compositions,
  published with actual local specimens. They reuse FactRow, ReferenceValues and
  SelectionField; there is no product renderer, CSS or callback-driven mutation.
- Known-empty body and Projects disappear from reading. Unknown data remains
  visible as unknown. Body whitespace, Unicode, newlines and user casing are
  preserved. Long values reflow rather than overflow or clip.
- Canonical Project names/colors remain visible and selected by ID. Status
  choices dispatch the existing Complete/Reopen journeys, including returning to
  Open after a mistaken completion. Opening/reselecting the control does not
  mutate the object.
- Note detail, Task detail/editor and Project collection/detail have meaningful
  header descriptions. Note detail no longer claims storage is local to the
  workspace: the actual controller owns storage.
- The existing multiline editor is retained and qualified for exact long draft
  content, native text selection and an explicit empty body. No second editor or
  separate domain validator was added.

## Installation compatibility

`tests/notes-tasks-presentation.test.ts` explicitly pins the expected existing
contract digest `07807ce6126189b23b686e4e614fb933785dc2418a5f24a1184dcb5c91b3c756`
as a regression assertion, not by modifying the installation. This equals the
preserved a9/a11 data contract. View definitions change the ViewProgram digest
and renderer changes require a new build; they do not migrate the store.

No object facts, field types, canonical commands, collection projections,
ownership policies or execution dependencies change in this slice. No database,
user data, installation digest or running preview was modified by this work.

## Independent expectations and evidence

- SDK `tests/object-detail-content.test.ts`: one property group after prose,
  exact user text, known-empty versus unknown, Project colors/names, reversible
  state commands, native multiline editing, 1600/390/320px and 200% text.
- SDK `tests/object-state-layout.test.ts`: actual state rows are measured, long
  values remain complete and end-aligned, no clipping or required markers.
- Existing reading, row geometry and fact-reference tests cover adjacent owners.
- VOID `tests/notes-tasks-presentation.test.ts`: unchanged installed data digest
  and all five explicit header descriptions.
- Browser screenshots: SDK `artifacts/object-detail-round3/`. These are isolated
  real component fixtures, not the running product or a replacement for its
  generated-build browser checks. Final command results belong in the parent
  delivery ledger.

## Domain work deliberately still open

Notes' historical colored labels, participants/revocation, collaboration,
conflict resolution and history are not implemented. They need typed objects
and policies; string labels would not honestly implement color or authority.
An absent title remains distinct from the currently supported present-empty
title and requires an optional-value contract.

Tasks' actor assignment, environment queues, conversation, deadlines/reminders,
dependencies and execution policy remain separate requirements. Existing
Projects are real private objects with colors, not the historical free-text
labels described by earlier documentation. No deadline, priority, actor or
additional label fact was invented in this round.

Persistent offline drafts are deferred. Current ordinary drafts are session
memory only; an already-open draft can survive a connection loss within that
session, but cannot claim durable local save. Before persistence is added, the
SDK needs explicit storage ownership, identity isolation, encryption/privacy,
expiry, failure/recovery behavior, draft schema compatibility and clear
unsynchronized state. Reconnection must not replay a central mutation without
an explicit user command. This record does not authorize a database reset or
installation repin to introduce any of those future capabilities.
