# Declarative product architecture

Direction recorded on 2026-10-20: one authoritative owner per rule, typed
references, legible declarations and consistent names. DRY does not mean one
large file. Generated projections and independent tests are not duplicate rules.

This is the target architecture, not an installed Module API or source migration.
[Code anatomy](ANATOMY.md) maps the actual files. Missing mechanisms belong in
DESERT, never in private VOID controllers, renderers or validators.

## Vocabulary and ownership

| Concept | Owns | Does not own |
| --- | --- | --- |
| Product | Root composition, mounted modules, entry and navigation choices | A second implementation of its modules |
| Module | A cohesive capability and explicit public contracts | A server/controller merely because it is a folder |
| Object and policy | Facts, invariants and authority | Embedded UI or callbacks |
| Command | A declared change and its canonical input contract | Form layout or an origin-specific activity |
| Journey | Activity, view bindings, transitions, commands and outcomes | CSS, infrastructure or unchecked handlers |
| Destination | Navigable identity, parameters and entry journey | A framework page or duplicated initial View binding |
| View | Ordered catalog composition and typed input/output ports | Journey IDs, permissions, execution or primitive styling |
| Navigation | Selection, grouping and ordering of destinations | Another destination definition or filesystem discovery |
| Catalog | Derived index of registered definitions | A parallel handwritten inventory |

Product is the single authored root. Do not add equivalent Application and
MainModule roots. Application may describe a compiled/running product internally.
Home is VOID's chosen initial destination, not a mandatory module or SDK-wide
rule. A module may provide several destinations, several views or none.

Use **visual surface** for a frame with content and docks, **interaction exposure**
for offered human/agent journeys, and **channel** for transports such as HTTP/MCP.
The installed API calls exposure `SurfaceDefinition`; this clarification does
not rename it. Renderer, distribution and physical deployment are distinct.

## Target anatomy

These paths are proposed; create files only as their contracts are implemented.

```text
src/
├── void.product.ts
├── navigation.ts                  Destination references, grouping and order
├── surfaces.ts                    Human/agent interaction exposure
├── views/
│   └── home.view.ts               Product-level composition
├── journeys/
│   └── browseHome.journey.ts      Product-level navigation and collaborations
└── modules/
    ├── index.ts                   Optional re-exports, no new module or runtime
    ├── identity/
    │   └── identity.module.ts
    └── notes/
        ├── notes.module.ts        Registration and explicit public boundary
        ├── note.object.ts
        ├── commands/
        │   └── createNote.command.ts
        ├── journeys/
        │   ├── browseNotes.journey.ts
        │   └── createNote.journey.ts
        ├── views/
        │   ├── notesHome.view.ts
        │   └── noteEditor.view.ts
        └── tests/
            └── … focused acceptance
```

Small destination declarations can live in their module manifest, or in the
Product for Home. Split a `.destination.ts` only when it improves cohesion.
There is no mandatory view per directory level. Cross-module activities belong
to the Product or a genuinely cohesive collaboration module.

Use role-qualified exports: `Note`, `NotesModule`, `CreateNoteCommand`,
`CreateNoteJourney`, `NotesHomeView`, `NotesHomeDestination`, `VoidProduct`.
Existing exports/serialized IDs are not silently renamed: contract and data
migrations must be explicit. IDs are semantic identities, not labels or paths.
References carry definition kind and compatible contract. A View cannot stand
in for a Journey. Each registered identity has one definition.

Declarations use `.ts`, not JSX or private components. The withdrawn proposal
for mandatory `x.views.ts` and `x.journeys.ts` aggregates is not adopted.

## Registration and collaboration

1. Each module registers owned definitions once and identifies public contracts
   by reference. Public authoring exports are not browser-safe data.
2. The Product mounts selected modules and adds its own compositions.
3. The compiler derives definition catalogs and the storyboard. The Product
   authors navigation choices, not a second inventory of views or transitions.
4. Surface projections expose only permitted information and operations.
   Registered, exported, exposed, available and authorized are different states.

Modules cannot import another module's implementation, storage or handlers.
Required public contracts remain explicit even through a bus. The composition
root binds compatible providers and rejects unresolved needs. Notes works
without Tasks; attaching a note to a task requires both contracts in that
collaboration, not hidden coupling in every Notes activity.

The shared runtime owns dispatch. Commands, queries and events retain distinct
semantics without requiring three buses, a broker or a service per module.
Internal requests preserve identity and authority, cannot bypass admission or
acceptance, and do not imply cross-object atomicity.

The installed `controllerRole()` declares execution responsibility for objects;
one role can govern several objects. It is not a product-written controller.
Execution placement remains separate from module organization. Keep existing
required role declarations until an explicit SDK migration replaces them.

## Views and navigation

Content is an ordered sequence, not a mandatory root Stack. Header stands alone;
each Stack has a visible title. Catalog owners define geometry, material,
feedback and motion. Products supply finite semantic properties, never generic
override bags. A visual catalog indexes the actual registered owners.

Journeys bind View outputs to admitted actions or navigation. Inputs come from
authorized projections. Command constraints are derived once, not copied into
fields and transport validators. A destination references its entry Journey,
not another independently maintained initial View.

Navigation occupies the **left dock**. The Notes editor requests the **right
dock**, falling back to transient when it does not fit. The shared host owns
fit calculation, occupancy, focus and adaptation; products cannot set private
breakpoints. The same view instance, draft and run survive reflow.

The sidebar is a normal catalog-composed surface: top Toolbar, titled navigation
Stacks and bottom Toolbar. It receives a navigation projection and emits
selection; it is not a router. Destination metadata owns labels/icons.
Detail/editor contexts preserve their navigation ancestor's selection without
renderer URL heuristics.

Home and Notes start the same CreateNoteJourney. Origin is typed runtime context,
not another activity definition. Uncertain acceptance reconciles the original
operation, never a replacement create. MCP/API preserve applicable journey
semantics without imitating visual docks, Home clicks or lock screens.

## Identity and entry

Use **Identity**, not User, for the domain. Identity kind, credentials, session,
role and delegation are separate. Only the administrator creates additional
identities; bootstrap is a separate one-time installation transition.
OAuth client registration cannot create a VOID identity.

The runtime distinguishes checking, setup-required, signed-out, locked,
authenticated and unavailable. Unknown/error never means setup-required.
Initial admin creation requires installation-bound proof, atomically consumed.
Opening the URL first grants nothing. An initialized installation never silently
reopens setup. Home follows access; authorized resume/deep links may retain
their destination without restarting the activity.

Lock denies protected operations and prevents late responses from repainting
private data; an overlay is insufficient. Recovery restores the same identity.
Administration/OAuth does not imply access to another identity's private notes.
Secret inputs cannot enter ordinary persisted drafts, logs or catalog examples.

Recovery proof, admin transfer/loss, agent identity versus human delegation,
lock scope and draft retention remain decisions to close before enabling them.
Authentication recovery does not imply recovery of lost encryption keys.
Minimum access security precedes a protected release; this does not move the
entire Identity vertical ahead of Notes.

## Enforcement and evidence

Canonical schemas supply authoring types and runtime shape validation; canonical
semantic checks resolve references, bindings and authority requirements.
A TypeScript cast or policy label cannot grant safety. Independent tests must
not derive expected outcomes from the interpreter under test.

| Required gate | Current evidence |
| --- | --- |
| Reject unknown View properties, callbacks, styling and schema mutation | Installed for literal N1a |
| Reject duplicate/missing View references and unbounded composition | Installed for literal N1a |
| Enforce ordered content, independent Header and titled Stacks | Installed for literal N1a |
| Deny unexposed journeys and unauthorized Notes reads/writes | Existing finite local runtime |
| Preserve one effect/receipt through acceptance retries | Existing Notes N0 proof |
| Reject private module imports, import-time effects and product infrastructure | Missing module/build boundary |
| Reject incompatible port payloads and unbound required outputs | Missing View/journey binding |
| Derive catalogs/storyboard and reject renderer-owned navigation | Missing general composition contract |
| Reject consumer CSS/AST escape hatches throughout the renderer | Ownership audit remains open |
| Preserve editor/run/draft through right dock and transient adaptation | Missing new-View host qualification |
| Deny bootstrap takeover, replay and concurrent second admin creation | Missing access runtime |
| Deny OAuth/login identity creation, recovery escalation and locked access | Missing identity lifecycle |
| Preserve admission and operation identity through module dispatch | Missing general integration protocol |

[Verification](VERIFICATION.md) records existing evidence, not success for planned
gates. Source restrictions require build checks; runtime boundaries remain
mandatory. Trusted TypeScript authoring is not a malicious-module sandbox.

## Next proof

Close the minimal schemas, references and bindings with independent positive and
negative fixtures. Connect one Product, NotesModule, Home/Notes destinations and
one reusable create activity to the SDK-owned renderer. Fixture previews stay
explicitly distinct from real authorized data. Qualify right-dock/transient
behavior and the actual catalog owners.

Access needs its own bootstrap/authentication/recovery proof before a protected
release. Preserve the stable build, stores and IDs. Do not leave the new binding
and a legacy implementation as two permanent authorities.
