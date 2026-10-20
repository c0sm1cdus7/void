# Reusable view declarations

The owner selected `views/*.view.ts` as the product's view vocabulary, separate
from `journeys/*.journey.ts`. Views declare typed information and output ports;
journeys bind them to activities. No product-owned markup, CSS or callbacks that
draw may appear here.

Five declarations now mount through `../experience.ts`: Home, Notes, note
editor, note detail and Visual catalog. `index.ts` validates their registry.
Each object satisfies the shared SDK `View` type and runtime validator.

Views name input/output ports, not commands. Journey bindings supply canonical
forms, collections and authorized context. The editor is currently bound only
to create; editing is not implemented. Visual catalog reuses the SDK inspection
owner and never executes product commands.

The executable program is deliberately finite. Unsupported docks, media,
bindings and extra styling properties fail validation. General module
composition is still a target, not permission to introduce product rendering.
