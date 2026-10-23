import test from 'node:test';
import assert from 'node:assert/strict';
import {localMedia} from '../scripts/local-media.ts';
import {VoidViewProgram} from '../src/void.product.ts';

test('private Media omits external sample assets and the empty local-media attestation',()=>{
  assert.deepEqual(localMedia(VoidViewProgram),{});
});
