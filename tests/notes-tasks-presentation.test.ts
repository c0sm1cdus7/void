import assert from 'node:assert/strict';
import test from 'node:test';
import { compile } from 'desert-sdk/src/index.ts';
import { VoidProduct, VoidViewProgram } from '../src/void.product.ts';

test('Notes and Tasks presentation refinements preserve the installed data contract',()=>{
  // DESERT slice 7.4 repins the data contract once: the image fact became file({ accept, maxBytes }) and its column now
  // references the SDK's asset object, so an installed a9/a11 store needs that storage migration before it serves.
  assert.equal(compile(VoidProduct).digest,'5d99a4c7053d5ecba4023e6cc19e18c8082f6eef23d71d20c39ff5c54cbb4130',
    'The original a9 installation stays authoritative; this presentation slice cannot repin or migrate its store');
});

test('object and editor headers explain their existing content without claiming local storage',()=>{
  const expected={
    'note-detail':'Read and edit your note.',
    'task-detail':'Review details, projects and progress.',
    'task-editor':'Describe the work and choose its projects.',
    projects:'Organize your tasks with named, colored projects.',
    'project-detail':'Use this project to group your personal tasks.',
  };
  for(const [id,subtitle] of Object.entries(expected)) {
    const view=VoidViewProgram.views.find(view=>view.id===id);
    assert.ok(view,`Published view ${id} exists`);
    const header=view.content.find(item=>item.kind==='header');
    assert.ok(header?.kind==='header');assert.equal(header.subtitle,subtitle,id);
  }
});
