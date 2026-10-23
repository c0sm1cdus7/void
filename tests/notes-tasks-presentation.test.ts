import assert from 'node:assert/strict';
import test from 'node:test';
import { compile } from 'desert-sdk/src/index.ts';
import { VoidProduct, VoidViewProgram } from '../src/void.product.ts';

test('Notes and Tasks presentation refinements preserve the installed data contract',()=>{
  assert.equal(compile(VoidProduct).digest,'07807ce6126189b23b686e4e614fb933785dc2418a5f24a1184dcb5c91b3c756',
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
