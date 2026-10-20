# VOID and DESERT code anatomy

VOID declares the product. DESERT validates and executes those declarations and
owns visual implementation. A product view is data, not a UI component.

This page maps installed source, not the target organization.
See [declarative product architecture](MODULE-ANATOMY.md) for the proposed
`src/modules` structure, naming, ownership and enforcement gates.
No source files have been moved.

## Product code in VOID

```text
void/
├── product.ts                     Domain product assembly
├── experience.ts                  Typed destinations, Views and journey bindings
├── dependencies.ts                Notes controller requirement
├── surfaces.ts                    Current human and agent journey exposure
├── objects/
│   └── note.ts                    Facts and ownership policy
├── commands/
│   └── createNote.command.ts       Declared create effect and derived inputs
├── journeys/
│   ├── createNote.journey.ts       Activity referencing the command
│   ├── readNotes.journey.ts        Authorized list/detail projection
│   ├── home.journey.ts             Presentation entry and create output
│   └── visualCatalog.journey.ts    Isolated catalog destination
├── views/
│   ├── home.view.ts               Header and titled content stacks
│   ├── notes.view.ts              Collection input and create/select outputs
│   ├── noteEditor.view.ts         Canonical form input and save/close outputs
│   ├── noteDetail.view.ts         Authorized context input and close output
│   ├── visualCatalog.view.ts      Shared web inspection composition
│   └── index.ts                   Validated View registry
├── scripts/                       SDK build and trusted local host entrypoints
└── tests/                         Independent contract and PostgreSQL checks
```

Read in this order:

1. [`objects/note.ts`](../objects/note.ts): `Note` declares title, body and owner.
   `PrivateNotes` references the canonical ownership policy.
2. [`commands/createNote.command.ts`](../commands/createNote.command.ts):
   `CreateNoteRecord` declares the values to persist. Owner comes from the
   trusted actor, never from a form-supplied owner string.
3. [`journeys/createNote.journey.ts`](../journeys/createNote.journey.ts):
   `CreateNote` references that command and its required controller.
4. [`journeys/readNotes.journey.ts`](../journeys/readNotes.journey.ts):
   `ReadNotes` declares the fields exposed for reading, not a second query service.
5. [`views/notes.view.ts`](../views/notes.view.ts): `NotesView` declares a Header,
   titled collection stack and outputs named `create` and `select`. It does not execute
   `CreateNote` or decide its permissions.
6. [`product.ts`](../product.ts) and [`surfaces.ts`](../surfaces.ts):
   the existing domain assembly and exposed journeys.

7. [`experience.ts`](../experience.ts) composes the validated View program.
   `CreateNoteExperience` and `ReadNotesExperience`, colocated with their domain
   journeys, bind ports to those same canonical operations. The build consumes
   the program explicitly; `product()` retains its domain-only contract.

## Mechanisms in DESERT

These are paths in the sibling DESERT checkout, not files to copy into VOID:

```text
desert/src/
├── index.ts                       Author-facing exports
├── contracts.ts                   Object/product grammar and helpers
├── commands.ts                    Typed effect declarations
├── journeys.ts                    Read and mutation journey declarations
├── views/
│   ├── schema.ts                  View, Header, Stack, Toolbar and dock grammar
│   ├── snapshot.ts                Bounded JSON normalization
│   ├── view.ts                    Canonical single-view validation
│   ├── catalog.ts                 View-reference validation and freezing
│   ├── program-schema.ts          Destinations and finite journey bindings
│   └── program.ts                 Complete executable-program admission
├── compile.ts                     Domain compilation
├── project-surface.ts             Limited client-facing domain projection
├── local/
│   ├── admission.ts               Session/journey admission
│   ├── prepare.ts                 Prepared effects
│   ├── accept.ts                  Atomic acceptance and receipts
│   └── developer-host.ts          Trusted local identity/store lifecycle
├── interaction/                   Existing catalog and interaction contracts
├── web/client/view-program.ts     Nonvisual View output interpreter
├── web/client/view-projection.ts  Canonical forms, collections and context
├── svelte/views/                  Shared View renderer and workspace owners
├── svelte/pieces/                 Existing primitives reused by those owners
└── build/                         Installed distribution builders
```

The new View renderer binds to the existing interaction artifact; legacy
products still use their previous entrypoint. Passing View validation does not
establish global catalog ownership for all existing Svelte files.

## Authoring boundary

`content` is an ordered array. A Header is not a Stack. A Stack must have a
nonblank title and may contain permitted catalog leaves. Top/bottom docks accept
Toolbar descriptors; side docks reference registered Views. Omitted docks stay
omitted. Product code cannot supply HTML, CSS, render functions or geometry.

N1 adds named collection/form/context inputs and output bindings for one
canonical read/create pair. It does not accept arbitrary queries, schema copies,
render functions or journey callbacks. Unsupported side docks and header media
fail admission in this executable slice rather than being silently ignored.

## Runtime boundary

The existing Notes flow already follows:

```text
Journey → admission → preparation → acceptance → durable receipt
```

The installed N1 visual flow is:

```text
View data → canonical validation → SDK projection → catalog renderer
View output → journey binding → the same admitted operation lifecycle
```

Views neither grant authority nor replace command validation, concurrency
checks or durable recovery. Full module composition and editing remain later work.
