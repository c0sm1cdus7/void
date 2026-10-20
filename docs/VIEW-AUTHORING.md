# Typed view authoring

Owner collaboration requirement recorded on 2026-10-20. The N1 web slice uses
literal Views, typed input/output bindings and the shared DESERT interpreter.
Home, Notes, the note editor/detail and Visual catalog are executable.
The [product architecture](MODULE-ANATOMY.md) owns the target module organization,
shared vocabulary and navigation responsibilities.

## Acceptance goal

A contributor creates a `*.view.ts` exporting a typed object, references it from
a `*.journey.ts`, and previews the result with SDK-owned components. They need
not write Svelte, CSS, a renderer or a private application server.

The author controls information hierarchy, composition, content order, permitted
docks and semantic actions. Catalog component owners control geometry,
typography, material, component adaptation, focus, feedback and motion. The
shared host owns available-space decisions and dock/transient presentation.
Composing the product must not reopen primitive overrides.

## Content is a sequence

The owner approved an ordered `content` array, not a mandatory root Stack.
A Header is independent. Each Stack has a required visible title. Catalog
content may also appear directly in the sequence. The sequence does not itself
add another visual container or grant geometry/style authority.

Target Media composition below; Media and authored side docks are not executable
in the installed N1 slice. See `views/notes.view.ts` for an executable collection:

```ts
export const mediaView = {
  version: ViewVersion,
  id: "media",
  topDock: mediaToolbar,
  leftDock: { kind: "view", view: "navigation" },
  content: [
    albumHeader,
    albumsStack,
    videosStack,
    musicStack,
    imagesStack,
  ],
  rightDock: { kind: "view", view: "media-details" },
} satisfies View;
```

`View` declares portable visual composition, not human/agent interaction exposure.
Toolbar, Header, Stack and collections
have their own closed descriptor types, not arbitrary nested Views. Dock slots
constrain accepted kinds and cardinality. Omitted docks reserve no space.
Conditional visibility and selected-item binding require typed contracts, not
arbitrary callbacks.

The snippet illustrates composition only. `viewCatalog` validates referenced
view IDs. `experience.ts` separately binds the installed Views to canonical
journeys and presentation destinations through `ViewProgram`.

## Installed executable subset

`View`, `ViewVersion`, `view` and `viewCatalog` are exported by the local SDK.
The Notes declaration imports them without product-owned UI or validators.
Its toolbar declares a `create` output, not a journey ID or an executable callback.
`ReadNotesExperience` binds that output to the existing create journey, which
opens `noteEditor.view.ts` with a right-dock preference.

The contract validates ordered content, titled Stacks, permitted dock kinds,
declared output references and a bounded acyclic view-reference graph.
`satisfies View` checks authoring; `view`/`viewCatalog` validate and freeze the
runtime JSON boundary. The web build compiles the `ViewProgram` against the
canonical human surface and rejects unbound or incompatible ports.

The installed interpreter deliberately supports one read/create pair plus
presentation destinations. It is not a general module integrator. Collection,
form and context inputs come from the canonical runtime; no product callback
can replace its validation, preparation, acceptance or recovery.

## Reuse without escape hatches

- References resolve validated descriptors, never Svelte constructors, HTML,
  render functions or generic property bags.
- A `*.component.ts` name cannot register product-owned rendering. Reusable
  compositions still use the closed catalog.
- The installed inputs are closed collection/form/context ports, not arbitrary
  paths or an expression language. Derived domain values belong in authorized
  projections.
- Collections use stable item identity. Updated data must preserve applicable
  focus/selection without retaining stale media.
- Composition references must be acyclic and bounded. Navigation can contain
  cycles without recursively embedding views.
- `satisfies View` helps the editor but is erased at runtime. Canonical validation
  must also reject unknown properties, invalid slots, unresolved references and
styling/callback escape hatches.

## Objects and presentations

"An object carries its view" should mean a typed association in a definition or
presentation registry, not UI embedded in each stored domain record.

Prefer a domain declaration beside its view definitions, with a registered
default detail presentation. Explicit card/row presentations can serve different
semantic contexts; one detail layout does not necessarily suit every host.
These presentations still use the same catalog owners.

The domain schema does not import Svelte. Only authorized projected data reaches
a view; hiding fields is not access control. The installed detail view occupies
the right dock or a transient surface. The shared host resolves that adaptation
without copies or product-defined breakpoints. Reusing it as a main destination
and general object-presentation associations remain future contracts.

## Views and journeys

A view declares typed inputs and output intents without naming journeys.
A journey binds outputs to navigation or admitted commands, including guards,
confirmation, errors and recovery. The renderer cannot execute arbitrary
handlers or invent a transition. A visible/enabled action is not authority.

Human, MCP and API share applicable journey state and action semantics.
MCP/API need not imitate visual docks, gestures or playback controls.

## Running and remaining work

`npm run web:build` builds the declared experience; `npm run dev` serves it with
the SDK local host. Notes actions write to the local development store.
Visual catalog is a separate presentation destination using isolated shared
specimens; it does not execute product commands.

The four browser acceptance tests cover navigation, create/read persistence,
adaptive presentation and the catalog. See [Verification](VERIFICATION.md).
Fixture-only product preview, general module integration, object-presentation
associations, editing, native parity and Media playback remain future work.
