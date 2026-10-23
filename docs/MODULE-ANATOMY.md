# Declarative product architecture

Direction recorded on 2026-10-20; source reconciled on 2026-10-22. One
authoritative owner per rule, typed references, legible declarations and
consistent names. Generated projections and independent expectations are not
duplicate product rules. [Code anatomy](ANATOMY.md) maps actual files; this
document distinguishes installed mechanisms from remaining requirements.

## Vocabulary and ownership

| Concept | Owns | Does not own |
| --- | --- | --- |
| Product | Mounted modules, root workspace, entry and navigation | A second implementation of each module |
| Module | A cohesive capability and explicit public contracts | A controller/server merely because it is a folder |
| Object and policy | Facts, invariants and authority | Embedded rendering or callbacks |
| Command | Declared change, input and subject requirements | Form layout or an origin-specific activity |
| Execution journey | Read/mutation intent, dependencies and canonical operation | A private command handler |
| View journey binding | Typed View outputs, source read, navigation and presentation | CSS, permission or a second implementation of the command |
| Conditional activity | Bounded steps collecting an installed command's inputs | New commands, arbitrary code or delegated authority |
| Destination | Navigable identity and entry journey | A framework page or duplicated initial View |
| View | Ordered catalog values and typed input/output ports | Journey IDs, execution, permissions or primitive styling |
| Navigation | Selection, grouping and ordering of destinations | Filesystem discovery or another destination definition |
| Catalog | Derived registered definitions | A handwritten parallel inventory |

Product is the single authored root. Do not add equivalent Application and
MainModule roots. Home is VOID's selected destination, not an SDK-wide rule.
A module may provide several destinations, Views or none.

Use **visual surface** for a frame with content/docks, **interaction exposure**
for offered human/agent execution, and **channel** for transports such as
HTTP/MCP. The installed API calls exposure `ExposureDefinition`; renderer,
distribution and deployment remain distinct.

## Installed anatomy

Only implemented capabilities have source folders. The current modules are
Notes, Tasks, Media, System, Appearance, Identity and Visual catalog. Connections
and Environments do not have placeholder destinations.

```text
src/
├── void.product.ts                 Single composition root
├── modules.ts                      Derived public reference catalogs
├── navigation.ts                   Destination groups, purpose and order
├── exposures.ts                     Human/agent exposure, not navigation
├── views/
│   ├── workspace.view.ts           Optional left dock + destination outlet
│   ├── navigation.view.ts          Identity + declared navigation
│   └── home.view.ts                Product-level composition
├── journeys/browseHome.journey.ts  Root collaboration through public references
└── modules/
    ├── notes/
    │   ├── notes.module.ts         Registration and explicit public exports
    │   ├── note.object.ts          Facts and private ownership
    │   ├── note.publication.ts     Detail View, fields, title and action references
    │   ├── notes.dependencies.ts   Execution role, not controller implementation
    │   ├── commands/              Create, edit, Trash and Restore effects
    │   ├── journeys/              Execution, View bindings and optional Guided note
    │   └── views/                 Notes, editor, detail, Trash and guided steps/review
    ├── tasks/                     Private personal tasks with Project labels; no actor assignment
    ├── media/                     Samples + private import/read/Rename/Trash/Restore
    ├── system/                    Observed controller status and inventory
    ├── appearance/                Shared device appearance preferences
    ├── identity/                  Current identity and session lock
    └── visualCatalog/             Existing web bank inspection
```

Infrastructure, distributions and independent acceptance tests stay outside
`src/`. The source gate runs before importing declarations. Existing public
names are not silently renamed; changes to serialized identities and installed
contracts require explicit evolution. Component placement IDs are generated
inside DESERT, not authored by product consumers.

There is no mandatory View per folder level. A cohesive module groups its own
commands, journeys and Views; root collaborations consume public references.
The withdrawn mandatory `x.views.ts`/`x.journeys.ts` aggregation is not adopted.

## Registration and collaboration

1. A module registers definitions once and selects its public contracts by object
   reference. Modules never import another module or the root catalog.
2. `moduleIndex(...)` derives public Journeys, Views, Commands, Destinations and
   Dependencies. Commands derive from exported execution journeys.
3. The Product mounts the catalog and adds its own compositions. Root consumers
   use issued references such as `Journeys.createNote`, not string lookups.
4. The compiler derives the wire program, definition inventory and storyboard.
   Registered, exported, exposed, available and authorized are different states.

Public `compile(VoidProduct)` consumes the issued composition, not detached wire
data. The build and controller host derive its admitted View program; an override
cannot substitute another program or restore standalone navigation. SDK protocol
tests may compile raw wire fixtures internally without creating a public product path.

Private implementation imports, forged handles and unresolved ownership fail.
Cross-module data collaboration is not made executable by a reference alone.
The runtime owns dispatch and preserves trusted identity, admission and atomic
acceptance. No product controller class, callback service or event broker is
introduced. A `controllerRole()` describes execution responsibility; the host
installs the SDK mechanism separately and cannot invent readiness.

## Views, rendering and navigation

`defineView()` consumes issued `Components` values, not raw renderer nodes.
Content is an ordered sequence: Header stands alone, each Stack is titled.
A View cannot declare CSS, arbitrary markup, render slots or geometry overrides.
Shared owners supply typography, geometry, pane material, input feedback and
motion. The catalog's current browser implementation is Svelte/shadcn; native
catalogs are not installed by declaring native distributions.

Journeys bind typed View outputs. Canonical command inputs and constraints
produce the form contract; Views do not redeclare validation. Publications
associate objects with detail Views, title facts, field representations and
offered action journeys. Availability and subject eligibility do not replace
the controller's fresh authority check.

`workspace.view.ts` declares Navigation in `leftDock` and the active destination
outlet. Child Views do not duplicate that dock. Navigation owns labels through
destination metadata and groups/order through the root navigation list. The
renderer does not infer sidebar entries from filenames or icons.

Notes requests the right-side shared presentation host, adapting to bottom
transient presentation on a narrow host. The renderer preserves its instance,
draft and run through supported reflow. Arbitrary authored right/nested docks
are still rejected; `preferredDock: "right"` is not a general dock-layout API.

Home and Notes start one creation journey. Lost acceptance replies reconcile
the original operation. The installed HTTP/MCP execution channels share
admission and receipts, but a serializable cross-surface View navigator and
cross-session ordinary-editor continuity are not installed.

## Identity and entry

Identity, credential, session, administrator role and delegation are separate.
The normal local host mounts an access boundary before the declared workspace:
first-admin onboarding, locked sign-in, ready identity or unavailable/checking
client state. Unknown connectivity never means an uninitialized installation.

First-admin initialization needs the host's one-use bootstrap invitation and an
atomic installation transition. Lock removes private content/drafts immediately
and persists a local deny barrier even when server revocation cannot be reached.
Only explicit authentication lifts that barrier. Server credentials, expiry and
revocation still govern protected operations; an overlay grants no protection.

The Identity View publishes current public identity data and lock, not an
administration console. Backend administrator-only create/list/disable methods
exist, but are not product actions or exposed as bypass endpoints. Canonical
identity-administration journeys, password recovery, agent OAuth, admin transfer,
delegation and encryption-key recovery remain unfinished. Administrator status
never implies access to another identity's private Notes or images.

## Enforcement and evidence

| Required boundary | Current implementation / remaining qualification |
| --- | --- |
| Issued component values, finite props, no raw View clones | Component builders, `defineView`, module/root admission and negative source/type tests |
| One navigation/source/field/review owner | Composition guards and explicit source-read bindings; no first-read inference |
| Product infrastructure or private-module imports | Source gate before build/host/inspection evaluation |
| Unauthorized reads/writes and stale versions | Canonical session admission, preparation and atomic acceptance |
| One effect/receipt across retries | Runtime tests for Notes, Tasks and private images |
| Responsive shared geometry and motion | Built browser evidence is tied to a specific artifact, not inferred from contracts |
| Bootstrap/lock/revocation | Real local identity, HTTP and browser tests; no recovery/OAuth claim |
| Conditional activities | Durable bounded kernel, human step interpreter and declared Guided note; exact browser qualification is separate |
| Whole renderer ownership | Finite active-owner boundaries are enforced; separately inventoried legacy debt is not erased by a zero-new-debt result |

Tests, source inspection, generated builds and human visual approval are
different evidence. [Verification](VERIFICATION.md) and the
[delivery record](OVERNIGHT-2026-10-22.md) identify actual results. Trusted
TypeScript authoring is not a sandbox for malicious code.

## Still outside the installed product

Collaborative Notes, external provisioning, remote environment
enrollment, task-to-actor execution/conversations and native parity are not
completed by this module architecture. Conditional activities reuse one
installed mutation; they do not install cross-identity assignment or
cross-object atomic workflows. Private image import is not a managed private
audio/video library. Preserve those requirements in the [roadmap](ROADMAP.md),
without fabricating tabs, providers or permissions to make it appear complete.
