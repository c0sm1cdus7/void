import test from 'node:test';
import assert from 'node:assert/strict';
import { VoidViewProgram } from '../src/void.product.ts';

test('every operation and destination page header provides a meaningful subtitle', () => {
  const views = new Set(VoidViewProgram.journeys.flatMap(journey =>
    journey.kind === 'read' ? [journey.view,journey.detailView] : 'view' in journey ? [journey.view] : []));
  for (const view of VoidViewProgram.views.filter(view => views.has(view.id))) {
    const header=view.content.find(item=>item.kind==='header');
    // Greeting headers resolve their subtitle from the current localized date.
    if(header && typeof header.title !== 'string' && header.title.kind === 'greeting') continue;
    if(header) assert.ok(header.subtitle?.trim(),`${view.id} needs a useful header subtitle`);
  }
});
