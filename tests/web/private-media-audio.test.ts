import test from 'node:test';
import assert from 'node:assert/strict';
import {browserFixture} from './fixture.ts';
import {privateAudioFile} from './media-fixture.ts';
import {Journeys} from '../../src/modules.ts';

test('Media imports supported audio through the same native entry and plays only authorized private bytes',async()=>{
  const f=await browserFixture();
  try{
    await f.page.getByRole('button',{name:'Media',exact:true}).click();
    const selecting=f.page.waitForEvent('filechooser');
    await f.page.getByRole('button',{name:'Add media',exact:true}).click();
    await(await selecting).setFiles(privateAudioFile());
    const panel=f.page.locator('[data-adaptive-surface]');await panel.waitFor();
    assert.equal(await panel.getAttribute('data-presentation'),'transient');
    await panel.getByRole('button',{name:'Add media',exact:true}).click();
    await f.page.waitForFunction(()=>{
      const player=document.querySelector<HTMLAudioElement>('[data-media-player="audio"]');
      return player?.readyState && player.src.startsWith('blob:') && player.duration===1;
    });
    await panel.getByRole('button',{name:'Play',exact:true}).click();
    await f.page.waitForFunction(()=>!document.querySelector<HTMLAudioElement>('[data-media-player="audio"]')?.paused);
    const [record]=await f.host.session.read((await f.host.session.begin(Journeys.readImages.id)).id);assert.ok(record);
    const [detail]=await f.host.session.read((await f.host.session.begin(Journeys.readImages.id,record.id)).id);
    assert.equal(detail?.facts.title,'');assert.equal((detail?.facts.image as {media?:string})?.media,'audio');
    assert.deepEqual(f.errors,[]);await f.screenshot('private-media-audio');
  }finally{await f.close();}
});
