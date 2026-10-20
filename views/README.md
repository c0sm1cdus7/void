# Reusable view declarations

The owner selected `views/*.view.ts` as the product's view vocabulary, separate
from `journeys/*.journey.ts`. Views declare typed information and output ports;
journeys bind them to activities. No product-owned markup, CSS or callbacks that
draw may appear here.

The first planned declarations are:

- `notes.view.ts`: the Notes destination.
- `noteEditor.view.ts`: a reusable editor, independent of create/edit journeys.
- `visualCatalog.view.ts`: the **Visual catalog** destination displaying the web
  surface's registered primitives and compositions.

These files must use the shared DESERT view contract when it is installed.
The current SDK does not yet supply that API; N0 tests the existing execution
foundation without inventing a private view engine or pretending a placeholder
is a rendered view.
