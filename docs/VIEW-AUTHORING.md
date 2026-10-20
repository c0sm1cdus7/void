# Typed view authoring proposal

Owner collaboration requirement recorded on 2026-10-20. This is a proposed
authoring experience, **not an installed DESERT API** or final approved schema.

## Acceptance goal

A contributor creates a `*.view.ts` exporting a typed object, references it from
a `*.journey.ts`, and previews the result with SDK-owned components. They need
not write Svelte, CSS, a renderer or a private application server.

The author controls information hierarchy, composition, content order, permitted
docks and semantic actions. The catalog controls geometry, typography, material,
responsive behavior, focus, feedback and motion. Composing the product must not
reopen primitive overrides.

## Shape under discussion

Illustrative syntax; referenced declarations are omitted:

```ts
export const mediaView = {
  id: "media",
  topDock: mediaToolbar,
  leftDock: navigationView,
  content: {
    kind: "stack",
    items: [
      albumHeader,
      albumsStack,
      videosStack,
      musicStack,
      imagesStack,
    ],
  },
  rightDock: mediaDetailsView,
} satisfies View;
```

`View` is the portable surface envelope. Toolbar, Header, Stack and collections
have their own closed descriptor types, not arbitrary nested Views. Dock slots
constrain accepted kinds and cardinality. Omitted docks reserve no space.
Conditional visibility and selected-item binding require typed contracts, not
arbitrary callbacks.

The snippet illustrates composition only. It does not define working imports,
data sources, authority, action bindings or the preview command.

## Reuse without escape hatches

- References resolve validated descriptors, never Svelte constructors, HTML,
  render functions or generic property bags.
- A `*.component.ts` name cannot register product-owned rendering. Reusable
  compositions still use the closed catalog.
- Start bindings with literals and typed input paths, not an expression language
  or arbitrary computations. Derived domain values belong in projections.
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
a view; hiding fields is not access control. The same detail view can occupy
the main surface or a side dock. The shared host resolves docking versus
transient presentation, without copies or product-defined breakpoints.

## Views and journeys

A view declares typed inputs and output intents without naming journeys.
A journey binds outputs to navigation or admitted commands, including guards,
confirmation, errors and recovery. The renderer cannot execute arbitrary
handlers or invent a transition. A visible/enabled action is not authority.

Human, MCP and API share applicable journey state and action semantics.
MCP/API need not imitate visual docks, gestures or playback controls.

## First demonstrable SDK slice

1. Export the closed View contract, references and typed input/output bindings;
   reject invalid examples at build and runtime.
2. Provide a preview entry point with realistic fixtures, no production
   credentials and no live command execution by default.
3. Author one Notes view and journey as objects, without private presentation
   code. Reuse one detail view in main and side hosts.
4. Derive Visual catalog examples and diagnostics from the same registrations.
5. Verify actual web behavior; do not infer native equivalence or Media playback.

Exported names, preview command and default-presentation association remain
design decisions. N0's passing tests do not establish this authoring experience.
