import assert from 'node:assert/strict';
import test from 'node:test';
import {browserFixture,settleMotion} from './fixture.ts';
import {privateAudioFile,privateVideoFile} from './media-fixture.ts';

for(const width of [390,1600])test(`private Media plays, seeks and releases real audio/video at ${width}px`,async()=>{
  const f=await browserFixture();
  try{
    await f.page.getByRole('button',{name:'Media',exact:true}).click();
    const video=await privateVideoFile(f.page);
    await f.page.setViewportSize({width,height:1000});
    for(const [kind,file] of [['video',video],['audio',privateAudioFile(6)]] as const){
      const choosing=f.page.waitForEvent('filechooser');
      await f.page.getByRole('button',{name:'Add media',exact:true}).click();await(await choosing).setFiles(file);
      const panel=f.page.locator('[data-adaptive-surface]');await panel.waitFor();
      await panel.getByRole('button',{name:'Add media',exact:true}).click();
      const player=panel.locator(kind);await player.waitFor({state:'attached'});
      await f.page.waitForFunction(kind=>document.querySelector<HTMLMediaElement>(kind)!.readyState>=1,kind);
      assert.equal(await player.evaluate(element=>(element as HTMLMediaElement).paused),true,'no autoplay');
      assert.match((await player.getAttribute('src'))!,/^blob:/,'authorized private bytes only');
      await panel.getByRole('button',{name:'Play',exact:true}).click();
      await f.page.waitForFunction(kind=>document.querySelector<HTMLMediaElement>(kind)!.currentTime>.1,kind);
      await panel.getByRole('button',{name:'Pause',exact:true}).click();
      const seek=panel.getByRole('slider',{name:'Playback position',exact:true});await seek.focus();await f.page.keyboard.press('ArrowRight');
      await panel.getByRole('button',{name:'Mute',exact:true}).click();
      assert.equal(await player.evaluate(element=>(element as HTMLMediaElement).muted),true);
      await panel.getByRole('slider',{name:'Volume',exact:true}).focus();await f.page.keyboard.press('ArrowRight');
      assert.equal(await player.evaluate(element=>(element as HTMLMediaElement).muted),false);
      await settleMotion(f.page);
      assert.equal(await panel.evaluate(element=>element.scrollWidth>element.clientWidth),false);
      await f.screenshot(`private-media-${kind}-${width}`);
      const previous=await player.elementHandle();await panel.getByRole('button',{name:'Close',exact:true}).first().click();
      await panel.waitFor({state:'hidden'});
      assert.equal(await previous!.evaluate(element=>(element as HTMLMediaElement).paused),true);
      assert.equal(await previous!.getAttribute('src'),null,'closing releases the detached player source');
    }
    assert.equal(f.operations.filter(operation=>operation.operation==='accept').length,2);
    assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});
