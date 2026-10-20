# Notes N0 verification

Executed on 2026-10-20 on macOS using Node 24.16.0, TypeScript 5.9.3 and
PostgreSQL 18.6 (Homebrew).

Tested DESERT source revision:
`d0a50d2ca5119645c89cb5a4ec6cb227a38e9360` (`v127a-stable`).
The SDK working tree differed only in documentation during this check.
The relative dependency `file:../desert` does not enforce this source revision;
this is an evidence record, not a published or immutable dependency pin.

## Command and result

With Node 24 selected on PATH, from the VOID repository:

```sh
npm run check
```

Independent final run: TypeScript passed; **9 tests passed**, zero failed,
cancelled or skipped; test duration 8.588 seconds.

1. N0 exposes only the same create/read journeys to human and agent sessions.
2. The canonical input accepts present-empty title but not absent or fabricated fields.
3. Another identity cannot enumerate or read a private note through either exposure.
4. Revocation denies an already-admitted read and prepared acceptance without effects.
5. Human and agent sessions use the same create/read semantics, not an MCP transport.
6. Malformed input fails canonical preparation without a note or receipt.
7. An untitled note is written only on acceptance and projected without its owner.
8. Concurrent and subsequent acceptance of one intent returns one object and receipt.
9. Controller and isolated PostgreSQL restart retain note and original operation receipt.

Tests use temporary PostgreSQL clusters and independently inspect persisted
objects and receipts. They do not connect to existing product databases.
An earlier invocation under Node 20 failed to load TypeScript test files;
that runner does not meet this repository's Node 24 prerequisite.

## Not established

This is not evidence of a completed Notes vertical, UI, migrated Visual catalog,
safe editing, original edit-base checking, collaborative merge, participants,
labels, real MCP transport, remote API, native build, release pipeline or
cross-platform rendering parity. Media is a separate design requirement, not
part of these passing tests.

See [Notes acceptance](NOTES-VERTICAL.md) for the full target. Public reproduction
remains blocked on an accessible, separately licensed DESERT distribution.
