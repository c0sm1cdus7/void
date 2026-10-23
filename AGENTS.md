# Working on VOID

VOID is a product consuming DESERT, not a fork of the SDK or an application with
its own renderer. Start from zero; do not copy another product implementation.

- Read `docs/ROADMAP.md` and `docs/NOTES-VERTICAL.md` before product work.
- Product declarations live under `src/`, grouped by capability in `src/modules/`.
  Activities use `journeys/*.journey.ts` and typed views use `views/*.view.ts`.
  These directories do not grant presentation or execution authority.
- `src/void.product.ts` is the single composition root. Module manifests register
  owned definitions once and explicitly export public contracts. Root consumers
  import manifests, not module internals. Modules never import another module.
- Build/host/inspection must run the SDK source gate before importing declarations.
  Infrastructure and tests stay outside `src/`; no handwritten catalog/registry.
- Use installed DESERT contracts. Missing SDK capabilities must be implemented
  in DESERT and tested there, never replaced with private product infrastructure.
- No product-owned HTML, CSS, Svelte components, render callbacks, primitive
  overrides, controller logic or duplicate business validators.
- Views do not know journey IDs. Journeys bind typed outputs to activities.
  Human, MCP and API must share applicable journey semantics and authority.
- Write independent expectations before implementation. Distinguish a runtime
  proof from a completed vertical, a view from a UI, and agent exposure from MCP.
- Keep source and maintained documentation in English. Prefer small modules.
- Never commit credentials, runtime data, host paths, private SDK source, Apple
  sample media or generated dependencies. Publication needs an explicit scope.
- Preserve the DESERT `v127a-stable` build, preview and data.
