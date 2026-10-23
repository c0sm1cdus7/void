# VOID delivery roadmap

Owner direction recorded on 2026-10-20. VOID is the reference product built with
the DESERT SDK, starting from zero in [c0sm1cdus7/void](https://github.com/c0sm1cdus7/void).
Landmarks remains a preserved visual baseline; its browsing anatomy is carried
forward in Media, not as a copied product.
The repository is public and MIT-licensed. Public reproducibility also requires
a publicly obtainable, independently licensed DESERT distribution.

## Product and SDK boundary

VOID declares its objects, policies, views and journeys. DESERT owns the grammar,
validation, runtime, surface protocols, renderers and their closed catalogs.
Missing capabilities belong in DESERT; VOID must not acquire a private UI engine,
controller, validator or provider execution bypass.

The installed composition groups capabilities under `src/modules/`, with reusable declarations
in `views/*.view.ts` and activities in `journeys/*.journey.ts` within each module.
Product-level compositions can remain outside modules. See the
[architecture and ownership contract](MODULE-ANATOMY.md). The SDK derives the
catalog and storyboard and validates source imports before evaluation. A filename
is a discoverable domain convention, not a
replacement for validation or permission to execute arbitrary author code.
Views declare typed information, input and output ports without journey IDs.
Journeys bind those ports to guarded transitions and commands. Runtime instances
have stable identities, current state and authorized data.

Destinations identify semantic locations, not URLs or platform widgets. Multiple
entrypoints can start the same journey. Home is VOID's chosen initial destination,
not a mandatory SDK/module convention or detour for deep links, restored work
or recovery. Navigation explicitly selects published destinations; the sidebar
does not enumerate every registered view.

The contributor-facing acceptance goal is to author a typed `View` object in a
`*.view.ts` file, bind it from a `*.journey.ts` and preview it without writing UI
implementation code. The installed path is `defineView({ ... })` with issued
`Components` values and typed ports/references; raw renderer node IDs are not
product authoring. See [code anatomy](ANATOMY.md) and the earlier
[authoring design record](VIEW-AUTHORING.md).

The storyboard is derived from the same declarations: entries, destinations,
states, views, transitions, guards, outcomes and recovery. It is not a second
manually authored flow.

Human, MCP and API must navigate the same applicable journeys and operation
lifecycle. A nonvisual surface exposes typed state and actions rather than
simulating clicks; a visual renderer cannot invent a transition. Availability
does not establish authority. Command acceptance and completion remain distinct.

## Delivery order

| Order | Vertical | Required outcome |
| --- | --- | --- |
| 1 | Notes | Durable creation, reading and safe editing through reusable views and shared journeys. Full scope includes untitled notes, labels, participation and collaborative behavior. |
| 2 | System | System settings and navigation through the same contracts. |
| 3 | Appearance | Shared preferences applied to the web Visual catalog, not per-component overrides. |
| 4 | Identity | Identity settings and context without inventing admin access to private content. |
| 5 | Connections | Authorized provisioning of tools/services such as GitHub, Resend, Railway and Apple Developer. |
| 6 | Environments | VOID CLI enrollment, host availability and discovered environment-bound actors. |
| 7 | Tasks | Task context, project labels, environment-bound assignment, queued execution and conversations with the assigned actor about that task. |

### Current source checkpoint — 2026-10-22

This is a scope snapshot, not a declaration that every row above is complete.
Exact build identity and executed tests belong to the
[delivery record](OVERNIGHT-2026-10-22.md), not to this roadmap.

| Capability | Installed slice | Still required |
| --- | --- | --- |
| Notes | Private durable create/read/edit, recoverable Trash/Restore, shared editor and object toolbar actions | Labels, participants/revocation, collaboration, merge and history |
| System | Observed controller readiness and compiled inventory | Product settings beyond the installed status composition |
| Appearance | Shared device-local preferences reflected by the existing catalog | Native/platform qualification and any future synchronized preference policy |
| Identity | First-admin bootstrap, password sign-in/lock and current-identity View | Canonical post-login administration, recovery, agent OAuth and delegation |
| Media | Typed sample image/video/audio library; private JPEG/PNG/WebP import, authorized detail/viewer and Rename/Trash/Restore | Private albums/thumbnail collection, private audio/video import, retention/quota reclamation |
| Tasks | Private create/read/edit/complete/reopen, typed Project labels and receipt recovery; built browser walkthrough at compact/desktop widths | Assignment, provider execution and task conversations |
| Connections / Environments | No product destination; isolated execution queue kernel only | Real provisioning, enrollment, actor availability, command/outbox integration and reconciliation |
| Conditional activities | Bounded durable step runtime, human step interpreter and tested VOID Guided note walkthrough | Delegation, assigned-activity inbox and cross-surface navigator continuity |

System's precise navigation nesting remains a design decision. The sequence
does not authorize provisioning accounts, installing software on machines,
creating cloud infrastructure or spending money.

The domain term is Identity, including humans and agents. Minimum access security
is a prerequisite for a protected product release, not a silent reordering of the
full Identity vertical: authorized first-admin bootstrap, lock/sign-in and recovery
need their own contracts and evidence. Only the admin creates further identities.
Password authentication, atomic first-admin initialization, locking and backend
admin-only provisioning are installed. Post-login identity administration is not
published in the product until it uses canonical declared operations. OAuth and
recovery remain unimplemented. See the [delivery record](OVERNIGHT-2026-10-22.md).

## Visual catalog

The former Component bank becomes **Visual catalog**, a destination within VOID.
Its declaration is `src/modules/visualCatalog/views/visualCatalog.view.ts`.
It displays the **web surface's** actual registered primitives and compositions;
it is not the entire portable SDK semantic bank and not a parallel specimen UI.

Svelte/shadcn owns the current web implementation. Other renderers realize the
same typed meaning with their own qualified catalogs. Appearance changes are
observable in this destination because it consumes the same owners as the product.
No custom CSS, slots that draw arbitrary markup or product-specific variants.

The product mounts the existing web inspection owner through the closed View program;
no specimen UI is copied into VOID. Full catalog ownership inventory and
enforcement closure remain required before a qualified public release.
The preserved Landmarks preview is not replaced during this proof.

## Media

The owner also requested a Media destination retaining Landmarks' approved
anatomy: child-album covers in the shared header, typed media collections and
one viewer for images, video and music. Media controls join the thumbnail strip
in the viewer's bottom dock. See [Media requirements and proposal](MEDIA.md).
This adds a destination without silently changing Notes-first delivery order.
Apple sample photographs must not be republished in the public VOID repository.
Private image bytes use an explicitly configured authenticated store, not the
sample `/media` allowlist or generated build catalog. Original preservation,
renditions, quotas and canonical acceptance are separate from album management.

## Connections and environments

Connections represent provisioning/access to external tools and services.
Environments represent execution hosts running VOID CLI. These are separate
concepts even when, for example, a Railway connection provisions a Linux host.

VOID CLI connects to VOID and bridges installed provider CLIs such as Kenon,
Claude and Codex. Hosting the VOID instance and exposing an environment are
independent choices. Provider memory and continuation remain provider-owned.
There is no new intelligence or actor-management program inside VOID.

An actor is an identity bound to an environment, not a global provider name.
Examples are "Kenon — MacBook Pro", "Claude — MacBook Pro" and
"Codex — Linux VM on Railway". Display labels are not credentials or identifiers.
The same provider on another environment is a different actor.

The product offers available actors for task assignment; it does not ask users
to create/manage provider sessions as a separate workflow. Internal provider
session lifecycle still needs an explicit protocol, without exposing it as a
new actor-management destination.

## Task execution and conversations

Projects act as task labels, not mandatory containers. They do not implicitly
introduce their own ownership, permissions or independent project lifecycle.
The installed `Task.projects` fact uses the SDK's `labels()` field: up to 12 values of 64
Unicode code points. Casing and visible insertion order are preserved; explicit
UI addition trims exterior whitespace, while the controller rejects noncanonical,
empty or exact-duplicate values instead of silently rewriting them. Comparison
is case-sensitive: `Void` and `void` are distinct. `[]` is an explicit empty
selection; a missing input is rejected, never filled by a server default.

Create and Edit assign the array through typed `fromInput` references; Read
publishes the same values with `tags` representation. Complete/Reopen preserve
them. They do not become text collection summaries, titles, implicit permissions
or remote Project objects. Scalar Activity steps reject labels until their own
typed answer contract supports arrays. No comma-separated or JSON-string fallback
is admitted.

Canonical runtime evidence: `tests/tasks-projects.test.ts`, `tests/tasks.test.ts`
and `tests/tasks-recovery.test.ts` cover create/edit/read, exact receipt replay,
64-code-point Unicode, explicit empty values, malformed inputs, private reads and
controller reconnection. Shared input and built-browser qualification are tracked
separately; these controller tests do not establish visual approval.

A task retains its conversation. Sending a message to its actor concerns that
task and preserves task identity/context; it does not become an unrelated chat.
Assignment, enqueueing, execution and outcome observation are distinct states.

VOID CLI queues jobs and enforces a configurable maximum concurrent workload
**per actor**. The limit is not global per provider. An actor always belongs to
an environment; a disconnected environment cannot be reported as available.

An isolated local host queue kernel now verifies durable enqueue acknowledgements,
exact operation deduplication, concurrency permits, lease fencing, cancellation
and uncertain outcomes within its bounded host protocol. A lost worker retains
its permit as uncertain; no automatic replay or provider reconciliation is claimed.
It does not yet integrate
canonical command acceptance, remote enrollment or provider adapters. A lost
response must not blindly enqueue the same work twice.
Queue order, offline retention, reassignment and limit-change behavior remain
explicit decisions. Do not assume FIFO, automatic retries or automatic migration.

Provisioning credentials, environment enrollment, delegated task authority and
revocation must be specified before connecting real accounts or invoking tools.
Discovering a CLI or selecting an actor grants no filesystem/shell authority.

## First implementation checkpoints

1. N0: executable create/read runtime proof using installed DESERT contracts,
   real isolated PostgreSQL and human/agent session exposure. No custom renderer.
2. N1: install the shared typed view/journey binding and complete web catalog
   ownership needed by Notes and Visual catalog. Define executable negative gates.
3. N2: safe private create/read/edit with original edit-base checks, durable
   recovery and the same reusable editor view. Verify actual web behavior.
4. N3: real MCP/API adapters and cross-surface recovery using the same journeys.
5. N4: qualified collaborative Notes, participants/revocation, labels and history.

These checkpoints do not reduce the Notes requirement. N0 is not a completed
vertical, N2 is not real-time collaboration, and agent exposure is not an MCP
server. See [Notes acceptance](NOTES-VERTICAL.md).

The original N1 plan had three observable deliveries:

- **N1a, contract:** ordered content with a standalone Header, titled Stacks,
  constrained docks and typed ports/references. Component-built authoring now
  replaces the initial raw literal-node experiment.
- **N1b, visible authoring proof:** SDK-owned View renderer/preview, using the
  existing catalog owners and explicit fixtures. No product UI implementation.
- **N1c, runtime binding:** authorized data and typed outputs connect to the
  actual Notes journeys; migrate the relevant Visual catalog destination.

Those deliveries and private safe editing are now installed; their earlier
evidence remains historical, not proof of every newer build. The ownership audit
and full Notes scope are not closed merely by completing a first web slice.
N3 has real HTTP/MCP adapters, but remote deployment, authentication and
cross-surface continuity remain narrower than its complete goal. N4 remains open.

Earlier Communicator, Library and destructive administration ideas are outside
this ordered delivery sequence, not silently implemented or deleted. Admin
access to private content and the encryption model remain unresolved.

## Community and release requirements

Community members should be able to understand, build, test, use and contribute
to the product. A public repository alone is insufficient. The current private
SDK dependency is an explicit onboarding blocker, not a hidden prerequisite.
Publish a reviewed, licensed SDK distribution before claiming public buildability;
VOID's MIT license does not relicense DESERT or third-party assets.

Work in branches in both repositories. VOID `main` is reserved for versioned
releases, not incremental development. The intended pipeline produces one version
for iOS, Android, Linux and Web with equivalent journey behavior. See
[release policy](RELEASES.md); native builders are not installed by this decision.
