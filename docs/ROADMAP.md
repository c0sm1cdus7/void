# VOID delivery roadmap

Owner direction recorded on 2026-10-20. VOID is the reference product built with
the DESERT SDK, starting from zero in [c0sm1cdus7/void](https://github.com/c0sm1cdus7/void).
Landmarks remains a preserved visual baseline; its browsing anatomy is carried
forward as the proposed Media destination, not as a copied product.
The repository is public and MIT-licensed. Public reproducibility also requires
a publicly obtainable, independently licensed DESERT distribution.

## Product and SDK boundary

VOID declares its objects, policies, views and journeys. DESERT owns the grammar,
validation, runtime, surface protocols, renderers and their closed catalogs.
Missing capabilities belong in DESERT; VOID must not acquire a private UI engine,
controller, validator or provider execution bypass.

Author reusable declarations in `views/*.view.ts` and activities in
`journeys/*.journey.ts`. A filename is a discoverable domain convention, not a
replacement for validation or permission to execute arbitrary author code.
Views declare typed information, input and output ports without journey IDs.
Journeys bind those ports to guarded transitions and commands. Runtime instances
have stable identities, current state and authorized data.

Destinations identify semantic locations, not URLs or platform widgets. Multiple
entrypoints can start the same journey. Home is the navigation root, not a
mandatory detour for deep links, restored work or recovery.

The contributor-facing acceptance goal is to author a typed `View` object in a
`*.view.ts` file, bind it from a `*.journey.ts` and preview it without writing UI
implementation code. See the [typed authoring proposal](VIEW-AUTHORING.md) for
the proposed boundary and current missing SDK capabilities.

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
| 4 | User | User settings and identity context without inventing admin access to private content. |
| 5 | Connections | Authorized provisioning of tools/services such as GitHub, Resend, Railway and Apple Developer. |
| 6 | Environments | VOID CLI enrollment, host availability and discovered environment-bound actors. |
| 7 | Tasks | Task context, project labels, environment-bound assignment, queued execution and conversations with the assigned actor about that task. |

System's precise navigation nesting remains a design decision. The sequence
does not authorize provisioning accounts, installing software on machines,
creating cloud infrastructure or spending money.

## Visual catalog

The former Component bank becomes **Visual catalog**, a destination within VOID.
Its requested declaration is `views/visualCatalog.view.ts`.
It displays the **web surface's** actual registered primitives and compositions;
it is not the entire portable SDK semantic bank and not a parallel specimen UI.

Svelte/shadcn owns the current web implementation. Other renderers realize the
same typed meaning with their own qualified catalogs. Appearance changes are
observable in this destination because it consumes the same owners as the product.
No custom CSS, slots that draw arbitrary markup or product-specific variants.

The existing bank must not simply be copied into VOID or renamed while retaining
renderer-owned presentation outside the catalog. Migration depends on the closed
view contract, complete ownership inventory and enforcement gates in DESERT.
The preserved Landmarks preview is not replaced during this proof.

## Media

The owner also requested a Media destination retaining Landmarks' approved
anatomy: child-album covers in the shared header, typed media collections and
one viewer for images, video and music. Media controls join the thumbnail strip
in the viewer's bottom dock. See [Media requirements and proposal](MEDIA.md).
This adds a destination without silently changing Notes-first delivery order.
Apple sample photographs must not be republished in the public VOID repository.

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
Single versus multiple project labels remains to be decided.

A task retains its conversation. Sending a message to its actor concerns that
task and preserves task identity/context; it does not become an unrelated chat.
Assignment, enqueueing, execution and outcome observation are distinct states.

VOID CLI queues jobs and enforces a configurable maximum concurrent workload
**per actor**. The limit is not global per provider. An actor always belongs to
an environment; a disconnected environment cannot be reported as available.

Before execution is enabled, define durable enqueue acknowledgements, operation
identity, reconnect reconciliation, concurrency permits, retry, cancellation and
uncertain outcomes. A lost response must not blindly enqueue the same work twice.
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
