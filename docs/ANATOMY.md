# VOID and DESERT code anatomy

VOID declares a product; DESERT validates, executes and renders it. Views are
typed data, not UI components. The capability migration is installed under
`src/`; this document maps actual files rather than a proposed tree.

`VoidHumanExposure` and `VoidAgentExposure` name interaction exposure, not separate
Notes applications. `exposures.ts` no longer declares an initial read, primary
action, subject-action list, field/label maps or submission/review maps. Composed
human exposure accepts only `id`, execution journey objects and `locale`.
The Product's Home entry and journey bindings are the only navigation owner.
DESERT rejects a second declaration even if it agrees. Fixed connection/draft/
reconnect guarantees also come from DESERT, not a product configuration block.

Field labels and representations now belong to Note's publication. Operation
labels and human review requirements belong to the module's execution
registrations. DESERT derives the existing canonical surface maps from those
owners. Public catalogs contain SDK-issued object references. Consumers use
`Journeys.createNote`, `Views.Notes` and `Destinations.Notes`, not string lookups.

## Product declarations

```text
src/
├── void.product.ts                  One root: mounted modules + Workspace + Home
├── navigation.ts                    Destination references, groups, purpose and order
├── exposures.ts                      Human and agent journey exposure
├── modules.ts                       Derived public references from mounted manifests
├── views/workspace.view.ts          Root: Navigation View in leftDock + active destination
├── views/navigation.view.ts         Product identity + the declared destination list
├── views/home.view.ts               Product-level Header and titled Stacks
├── journeys/browseHome.journey.ts   Home outputs → public Notes journey
└── modules/
    ├── notes/
    │   ├── notes.module.ts          Owned registrations and explicit exports
    │   ├── note.object.ts           Facts and ownership policy
    │   ├── note.publication.ts      Detail View, field presentation, title and actions
    │   ├── notes.dependencies.ts    Execution-role declaration, not a controller
    │   ├── commands/createNote.command.ts
    │   ├── commands/editNote.command.ts
    │   ├── commands/trashNote.command.ts
    │   ├── commands/restoreNote.command.ts
    │   ├── journeys/
    │   │   ├── createNote.journey.ts
    │   │   ├── editNote.journey.ts
    │   │   ├── browseNotes.journey.ts
    │   │   ├── readNotes.journey.ts
    │   │   ├── readTrash.journey.ts
    │   │   ├── browseTrash.journey.ts
    │   │   ├── trashNote.journey.ts
    │   │   ├── guidedNote.journey.ts
    │   │   └── restoreNote.journey.ts
    │   └── views/
    │       ├── notesHome.view.ts
    │       ├── noteEditor.view.ts
    │       ├── noteDetail.view.ts
    │       ├── noteTitle.view.ts
    │       ├── noteBody.view.ts
    │       ├── noteReview.view.ts
    │       └── trash.view.ts
    ├── tasks/                      Personal Task, typed Project labels and guarded commands
    ├── system/                     Observed controller status and contract inventory
    ├── appearance/                 One device preference applied to every destination
    ├── identity/                   Current identity and session-lock output
    ├── media/
    │   ├── media.module.ts          Sample Media + private image registrations
    │   ├── media.library.ts         Typed local album/image/video/audio references
    │   ├── image.object.ts          Private image fact, title, state and owner
    │   ├── image.publication.ts     Authorized detail image presentation
    │   ├── media.dependencies.ts    Private image execution role
    │   ├── commands/importImage.command.ts
    │   ├── commands/renameImage.command.ts
    │   ├── commands/trashImage.command.ts
    │   ├── commands/restoreImage.command.ts
    │   ├── journeys/               Samples, private import/read/rename/Trash/Restore
    │   └── views/                  Sample library, private list, import, detail and Trash
    └── visualCatalog/
        ├── visualCatalog.module.ts
        ├── journeys/browseVisualCatalog.journey.ts
        └── views/visualCatalog.view.ts
```

`distributions.ts`, `scripts/` and `tests/` remain outside product declarations.
They select SDK infrastructure, build/host the product and verify behavior. No
private product controller, renderer, stylesheet or business validator exists.

## Reading order

1. [`note.object.ts`](../src/modules/notes/note.object.ts) declares `Note` and
   its private ownership policy.
2. [`createNote.command.ts`](../src/modules/notes/commands/createNote.command.ts)
   declares the effect. The trusted actor supplies ownership; input does not.
3. [`createNote.journey.ts`](../src/modules/notes/journeys/createNote.journey.ts)
   and [`editNote.journey.ts`](../src/modules/notes/journeys/editNote.journey.ts)
   bind their commands to the same editor and its typed save/close outputs.
   Edit explicitly initializes inputs from the authorized source read; the SDK
   retains the original record revision through preparation and recovery.
4. [`notesHome.view.ts`](../src/modules/notes/views/notesHome.view.ts) declares
   a standalone Header, titled collection Stack and create/select/Trash/Guided outputs.
   The View has no journey IDs, geometry or command callbacks.
5. [`note.publication.ts`](../src/modules/notes/note.publication.ts) associates
   Note with its detail View, title fact, field labels/representations and
   Edit/Trash/Restore journeys. These are presentation metadata, not facts stored in each note and
   not permission to execute Edit.
   [`notes.module.ts`](../src/modules/notes/notes.module.ts) registers owned
   definitions once, supplies execution labels and mutation review requirements,
   and publishes journeys, reusable Views, its destination and execution role.
   The object itself remains private.
   The read binding explicitly references `detailView`; the publication validates
   and decorates that View, rather than selecting an implicit fallback.
6. [`browseHome.journey.ts`](../src/journeys/browseHome.journey.ts) references
   the module's public create journey. Notes itself does not depend on Home.
7. [`media.view.ts`](../src/modules/media/views/media.view.ts) declares Media's
   header and sample library plus navigation to private image import/read.
   The SDK renders the approved media compositions; private bytes are not part
   of the public sample library or build manifest.
8. [`void.product.ts`](../src/void.product.ts) mounts the manifests selected by [`modules.ts`](../src/modules.ts),
   adds Home and the Workspace/Navigation Views, and selects workspace/entry/navigation/exposure. `VOID` and `VoidViewProgram`
   are derived exports, not separately authored registries.

Run `npm run inspect` to see the derived definition catalog, storyboard and
contract digest. It does not read notes or execute commands.

## Human semantics, declared with their owners

In [`exposures.ts`](../src/exposures.ts), `ExposedJourneys` selects the public
execution references from [`modules.ts`](../src/modules.ts). This excerpt shows
the Notes create/read/edit subset; the actual exposures also include Trash/Restore,
Tasks and private image reads. Import image is human-only until an actual binary
agent acquisition mechanism exists:

```ts
const ExposedJourneys = [Journeys.createNote, Journeys.readNotes, Journeys.editNote];

export const VoidHumanExposure = humanExposure({
  id: "human",
  journeys: ExposedJourneys,
  locale: "en",
});
```

`moduleIndex([...mountedManifests])` derives `Journeys`, `Views`, `Commands`,
`Destinations` and `Dependencies` from
the manifests' public exports. These are projections of one catalog, not manually
maintained registries. Commands derive from exported mutation journeys; a command
reference is not a separate execution API. The module's Note object stays private.

Within Notes, `view: NoteEditorView` and `journey: CreateNote` reference the
registered objects directly. Across the root/module boundary, consumers receive
opaque frozen handles. The SDK admits their exact registered module before
serializing IDs; copying a handle's `{ kind, owner, id }` does not create authority.
Home is composed after the module catalog, so its use of `Journeys.createNote`
does not create a circular import back into its own registration.

This excerpt shows the title/body/Edit portion of the object publication in
[`note.publication.ts`](../src/modules/notes/note.publication.ts):

```ts
export const PublishedNote = publishObject(Note, {
  view: NoteDetailView,
  title: factReference(Note, "title"),
  fields: [
    { fact: factReference(Note, "title"), label: "Title", representation: "text" },
    { fact: factReference(Note, "body"), label: "Content", representation: "paragraphs" },
  ],
  actions: [{ journey: EditNote, icon: "edit" }],
});
```

The `journeys` array in [`notes.module.ts`](../src/modules/notes/notes.module.ts)
registers these execution/presentation pairs once:

```ts
[
  { execution: CreateNote, presentation: CreateNoteJourney, label: "Create note", humanReview: "not-required" },
  { execution: ReadNotes, presentation: ReadNotesJourney, label: "Notes" },
  { execution: EditNote, presentation: EditNoteJourney, label: "Edit note", humanReview: "not-required" },
]
```

[`compileExposures`](../../desert/src/modules/compile-exposures.ts) derives
canonical `language`, `fieldRepresentations` and `commit` maps from these owners before
the SDK's internal wire compilation. Public hosts/builds call `compile(VoidProduct)`,
not `compile(VOID)`. `paragraphs` maps to the existing multiline reading presentation;
forms derive the multiline control only for an authorized command input.
`humanReview: "not-required"` maps to `submit`. `required` would map to `review`.
Neither choice bypasses admission, preparation, atomic acceptance or receipts.
The View's `save` output only requests submission; it does not choose review policy.

Products cannot author those maps again, override
[connection policy](../../desert/src/connection-policy.ts), or give exposure a
second [navigation owner](../../desert/src/navigation-ownership.ts). Missing
field labels/representations, operation labels or mutation review requirements
fail composition. Foreign and duplicate field references fail as well.
Generated maps remain part of the canonical protocol, not duplicate product
configuration. Stored Note facts and the compiled object View publication do not
carry the authored field metadata.

Read-only paragraphs use the same publication without exposing an editor or a
mutation. The canonical representation map replaces `inputs`; there is no second
reading override or compatibility fallback. This explicit contract evolution
changes the installation digest, not Note facts or command authority. `locale`
does not provide a translation service.

## Entry and left navigation

[`workspace.view.ts`](../src/views/workspace.view.ts) declares the persistent
composition. It references [`NavigationView`](../src/views/navigation.view.ts)
in `leftDock` and a `destination` outlet in `content`. `void.product.ts` selects
this exact object as `workspace`; no renderer infers a sidebar from the product name.
Home, Notes and Media occupy that outlet, so their Views do not repeat `leftDock`.

```ts
export const WorkspaceView = defineView({
  name: "workspace",
  leftDock: Components.Dock(NavigationView),
  content: [Components.Destination()],
});
```

NavigationView declares `Components.Header({ title: ViewTitles.product })` and
`Components.Navigation()`, which consumes the one product navigation list below.
It does not duplicate destinations. Omitting `leftDock` mounts no navigation
surface or disclosure action. The current bounded root supports this composition,
not arbitrary side-dock Views: nested/right docks and unsupported slots fail
compilation. System, Appearance and Identity are explicit utility destinations;
no undeclared disabled Settings placeholder is injected by the renderer.

The root explicitly sets `entry: HomeDestination`. It does not discover a
Home by filename, force every journey through Home or inspect authentication
state to choose onboarding. [navigation.ts](../src/navigation.ts) declares the
ordered destinations: Home, Notes, Tasks, Media, System, Appearance, Identity and
Visual catalog. That list feeds the
shared left navigation surface; it is not a list of every registered View.
Each entry explicitly declares its group and purpose: Home, Notes and Media are
Explore/content; Visual catalog is Developer/utility. Changing a destination's
icon cannot move it to a different group. A reachable destination may be omitted
from this navigation list without becoming an invalid registration.

The normal local host uses DESERT's protected identity entrypoint. Before mounting
the product, a session gate chooses first-admin initialization, locked sign-in or
the authenticated workspace. Home remains the product's entry after that gate.
The gate is a security boundary, not a duplicate product navigation declaration.
An explicit developer host remains available only to isolated test fixtures.
Protected requests bind the mounted workspace to its authenticated session;
changing identity in another browser tab retires that workspace instead of
silently submitting its draft through the new shared cookie. Late responses do
not revive it. Activity recovery remains scoped to the original identity, and
an uncertain acceptance is recovered by receipt, never automatically replayed.
Recovery and agent OAuth are not implemented. Post-login identity administration
is not published as an ad-hoc UI that bypasses the journey catalog.

## Ownership and enforcement

The SDK's `defineModule()` validates registrations and public references.
`composeProduct()` resolves the mounted modules and derives the domain product,
View program, catalog and storyboard. It rejects duplicate identities and
unresolved/private cross-owner references rather than letting renderers guess.
The public compiler accepts only that issued composition. Builders and controller
hosts derive its already-admitted View program; there is no `viewProgram` override
or standalone human-product fallback. `VOID` and `VoidViewProgram` remain useful
derived inspection exports, not a second authoring/build path.

All supported build, host and inspection scripts run `assertProductSource()`
**before importing product code**. The source gate rejects private module
imports, import-time execution, infrastructure imports, styling and arbitrary
render functions. Modules expose their manifest, not implementation re-exports.
Root compositions consume the manifest-derived public catalogs. The source gate
allows a View to import proven View projections, not journeys or commands hidden
behind an alias named `Views`. Module implementation imports remain private.
This is a trusted-authoring boundary, not a malicious TypeScript sandbox.

The old top-level `product.ts`, `experience.ts` and manual View index have been
removed. There is no second MainModule, controller per module or runtime bus
inside VOID. The SDK retains its canonical session/admission/acceptance path.
Despite its name, `NotesController` in
[notes.dependencies.ts](../src/modules/notes/notes.dependencies.ts) is only a
`controllerRole({ id: "notes", objects: [Note], requires: [] })` declaration.
The [local host script](../scripts/run-local.ts) resolves that exported role;
DESERT supplies the implementation. There is no `notes.controller.ts` class,
private controller API or callback service behind that symbol.

## Execution and rendering

```text
Module declarations → Product composition → derived catalog + storyboard
Mutation output → journey binding → admission → preparation → acceptance → receipt
View data → shared SDK projection → existing catalog renderer
```

The web interpreter supports multiple read/create flows, explicit input-bearing
updates and input-free guarded actions. A bounded conditional-activity runtime
and human step interpreter reuse canonical commands; Guided note collects title
and body, persists acknowledged steps, permits Back with approval invalidation,
then explicitly reviews and accepts the original create command. Branches may
depend on earlier scalar answers, but canonical command requirements remain
unchanged. These are not arbitrary workflows or cross-object transactions.
Cross-identity delegation and cross-surface continuation are not installed.
The typed sample library supports images, video and audio; private image import
uses a separate authenticated controller path. Unsupported formats and docks fail.
Home, Media, System, Appearance, Identity and Visual catalog are presentation-only
bindings. Human and agent exposures share Notes, Tasks and published private-media
metadata/lifecycle execution, not browser image acquisition or every
navigation activity. Navigation and
closing are not mutations and do not run through preparation/acceptance.
The Notes editor uses the existing shared right-dock/transient
host. The same approved primitive owners, geometry, toolbar, search and motion
remain in DESERT. No visual implementation moved into VOID.

The actual rendering route starts at SDK
[ViewProduct](../../desert/src/svelte/catalog/renderer/view-product/ViewProduct.svelte), not a VOID page
component. It passes the model snapshot through the
[generated catalog index](../../desert/src/svelte/catalog/index.ts) to
[ViewWorkspace](../../desert/src/svelte/catalog/compositions/view-workspace/ViewWorkspace.svelte), which
resolves the declared root through the SDK's
[workspace resolver](../../desert/src/views/program-workspace.ts), then composes
the existing shell, declared navigation, search overlay and retained content.

| VOID declaration | Shared catalog composition |
| --- | --- |
| [Notes home](../src/modules/notes/views/notesHome.view.ts) | Ordered [ContentFlow](../../desert/src/svelte/catalog/compositions/content-flow/ContentFlow.svelte): standalone Header, titled Stack and bound collection. |
| [Note detail](../src/modules/notes/views/noteDetail.view.ts) and [editor](../src/modules/notes/views/noteEditor.view.ts) | Resolved Panel → existing Drawer → SurfaceFrame. Titles and available actions are resolved before rendering. |
| [Visual catalog](../src/modules/visualCatalog/views/visualCatalog.view.ts) | Inspection adapter → [Inspection](../../desert/src/svelte/catalog/compositions/inspection/Inspection.svelte) → [InspectionCatalog](../../desert/src/svelte/catalog/compositions/inspection-catalog/InspectionCatalog.svelte), using the actual web bank and local specimens. |
| [Media](../src/modules/media/views/media.view.ts) | Media adapter → [MediaLibrary](../../desert/src/svelte/catalog/compositions/library/Library.svelte) → existing catalog hero/cards and shared Viewer. |

These are bounded SDK owners, not product overrides or replacement screens.
Render adapters select them using typed props; owners implement the DOM,
geometry and motion. Their internal implementation remains subject to the
ownership audit: a closed public gateway is not global visual qualification.

Styles enter through DESERT's generated
[root layout](../../desert/src/build/svelte/template/src/routes/+layout.svelte),
which imports the existing [theme](../../desert/src/svelte/theme.css). The
[generated page](../../desert/src/build/svelte/template/src/routes/+page.svelte)
mounts the session gate, which selects `ViewProduct` only after access is ready;
the View adapter neither styles itself nor relies on
loading a legacy product renderer for its stylesheet. Shared catalog appearance
is mounted by the workspace owner, not declared or overridden by VOID.

## One concrete editing path

```text
note.object.ts                  Note facts and private ownership
  ├── editNote.command.ts       Input: title/body → declared update
  ├── editNote.journey.ts       Controller + original read + editor bindings
  └── note.publication.ts       Detail View + title fact + Edit action
          ↓ notes.module.ts
void.product.ts                Compose mounted capabilities and Home
          ↓ DESERT
compile → authorized read → detail toolbar → Edit → reused editor
          ↓
begin → prepare with original version → accept → original receipt
```

The editor emits `save`; it does not call a command. The journey binds that
output to submission. The shared controller validates and commits the effect.
The renderer receives resolved descriptors and uses its catalog; it neither
decides ownership nor invents the command's inputs.

In the actual detail View, `title: ViewTitles.subject` requests Note's
published title fact. The reused editor instead requests
`title: ViewTitles.operation`, so create and edit receive their respective
canonical labels. Literal titles are not overwritten. Note publishes Edit, Trash and Restore through typed journey/icon pairs; the shared projection checks
source read, controller availability and subject eligibility before enabling it.
An empty stored title is displayed as a fallback, not replaced in the record.

DESERT also binds each rendered activity's events to its runtime instance. A late
event from a removed editor cannot mutate a newly opened editor or accept a newer
review. Reusing `noteEditor.view.ts` therefore does not reuse an old event's
authority. The outer dock/transient host remains mounted for the approved motion.

The generated web build checks both the migrated visual source boundaries and
Svelte component types before emitting its artifact. VOID does not define a
parallel component bank or CSS escape to make an invalid declaration render.

The old create/read build remains an independently tested baseline. Adding Edit
changes the domain digest; this is not permission to bypass installation checks.
On 2026-10-21 the owner explicitly authorized discarding VOID's disposable local
test data. Only `.local/void` was removed, then recreated by the architecture-f
host on port 4400. SDK sources, stable builds and reference photographs were not
removed. Tests continue to use isolated stores. This reset does not implement a
general data migration or imply that later source changes are already deployed.

## Current product versus roadmap

Installed source includes private Notes create/read/edit/Trash/Restore and durable Guided note, personal
Tasks create/read/edit/complete/reopen with typed Project labels, System, device Appearance, identity access,
the typed sample Media library, private image import/read/Rename/Trash/Restore and Visual catalog.
Sample Media uses externally bound reference photographs and locally generated
video/audio samples. Private JPEG/PNG/WebP imports preserve originals and create
bounded renditions in an explicitly installed private store, with canonical
ownership/admission/acceptance. The first private collection lists titles and
opens image detail/the shared viewer; private album management and audio/video
import are not implemented.

Connections, production environment enrollment, provider execution, task-to-actor
links/conversations, collaborative Notes and identity recovery/OAuth
remain unfinished. The isolated host execution-queue kernel is tested, but it is
not exposed as a fictional working Environments module. The same distinction
applies to conditional activities: their durable runtime and human step interpreter
exist. VOID now declares Guided note (Title → Content → Review) against the same
CreateNote command; build-specific walkthrough evidence is separate, and delegation is absent.
Exact built-browser qualification is recorded separately. Native binaries remain unqualified.
See [overnight decisions and evidence](OVERNIGHT-2026-10-22.md) and the
[roadmap](ROADMAP.md) for exact delivery scope.

## SDK source map

The [DESERT SDK anatomy](../../desert/docs/architecture/ANATOMY.md) links every
architectural layer: authoring schemas, module composition, execution, controller
availability, transport, nonvisual projection, catalogs and shared visual owners.
It also identifies requirements that remain unimplemented rather than presenting
them as working features.

See [architecture rules](MODULE-ANATOMY.md), [verification](VERIFICATION.md) and
[remaining Notes requirements](NOTES-VERTICAL.md) for the exact boundary.
