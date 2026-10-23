# Typed view authoring

Owner collaboration requirement recorded on 2026-10-20, updated 2026-10-22.
Views are constructed with typed `Components` and `defineView`, using the shared
DESERT interpreter. Raw descriptors are an internal wire format, not an authoring API.
The [product architecture](MODULE-ANATOMY.md) owns the installed module organization,
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

The actual Media declaration uses independent header and library compositions.
See [media.view.ts](../src/modules/media/views/media.view.ts):

```ts
export const MediaView = defineView({
  name: "media",
  content: [
    Components.Header({ title: "Media", subtitle: "Explore your albums and images." }),
    Components.MediaLibrary({ library: LocalPhotoLibrary }),
  ],
});
```

`View` declares portable visual composition, not human/agent interaction exposure.
Toolbar, Header, Stack and collections
have their own closed descriptor types, not arbitrary nested Views. Dock slots
constrain accepted kinds and cardinality. Omitted docks reserve no space.
Conditional visibility and selected-item binding require typed contracts, not
arbitrary callbacks.

Module manifests register these exact View objects and journey bindings.
`src/modules.ts` derives their public reference catalogs; `src/void.product.ts`
mounts them and DESERT derives the executable `ViewProgram`. Side-dock references
use View objects or published `Views` handles, never string lookups. Arbitrary
authored side-dock rendering remains bounded. The same Media viewer supports
admitted image, video and audio entries; this does not imply authenticated upload.

## Installed executable subset

`defineView`, `Components`, `ViewTitles` and `viewPorts` are the authoring API.
The Notes declaration imports them without product-owned UI or validators.
Its toolbar declares a `create` output, not a journey ID or an executable callback.
`ReadNotesExperience` binds that output to the existing create journey, which
opens `noteEditor.view.ts` with a right-dock preference.

The contract validates ordered content, titled Stacks, permitted dock kinds,
declared output references and a bounded acyclic view-reference graph.
`defineView` checks exact component properties and records the definition's
provenance. Module/product composition rejects raw, copied or serialized View
objects, then admits registered references before lowering them into the wire
format. The web build compiles the `ViewProgram` against the
canonical human surface and rejects unbound or incompatible ports.

The installed interpreter supports multiple scoped read/create flows,
input-bearing updates and presentation destinations. An update explicitly names
its source read and maps each input from an authorized fact. Collection,
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
- TypeScript checks are not runtime authority. Component provenance and canonical
  validation also reject unknown properties, invalid slots, unresolved references
  and styling/callback escape hatches.

## Objects and presentations

"An object carries its view" is a typed publication alongside its definition,
not UI embedded in each stored domain record. `note.publication.ts` calls
`publishObject(Note, { view, title, actions })`; the module registers that
publication. The SDK derives the presentation index, not a second authored registry.

Prefer a domain declaration beside its view definitions, with a registered
default detail presentation. Explicit card/row presentations can serve different
semantic contexts; one detail layout does not necessarily suit every host.
These presentations still use the same catalog owners.

The domain schema does not import Svelte. Only authorized projected data reaches
a view; hiding fields is not access control. The installed detail view occupies
the right dock or a transient surface. The shared host resolves that adaptation
without copies or product-defined breakpoints. Reusing it as a main destination
and arbitrary alternative row/card presentations remain future contracts.

Headers explicitly declare literal text, `ViewTitles.subject` for the
published object's title or `ViewTitles.operation` for the current
create/update label. Unsupported combinations fail at program admission.
A literal title is never silently overwritten. The renderer receives resolved
text, not a callback or a rule to infer the active operation.

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

Browser acceptance tests cover navigation, Notes persistence/editing, Media,
adaptive presentation and the catalog. See [Verification](VERIFICATION.md) for
the executed build and counts.
The separate installed activity runtime supports bounded conditional steps and
canonical preflight, but a human step UI and delegated activities remain future
work, as does native parity. Actual new build evidence belongs in
Verification, not in the existence of these declarations.
