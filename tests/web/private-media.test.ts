import assert from 'node:assert/strict';
import test from 'node:test';
import { browserFixture, settleMotion } from './fixture.ts';
import { Journeys } from '../../src/modules.ts';
import { choosePrivateImage } from './media-ui.ts';

for (const width of [390,1600]) test(`private media starts with a native picker, stays transient and preserves the original at ${width}px`,async()=>{
  const f=await browserFixture();
  try {
    const button=(name:string)=>f.page.getByRole('button',{name,exact:true});
    await button('Media').click(); await f.page.setViewportSize({width,height:1000});
    const panel=await choosePrivateImage(f.page);
    assert.equal(f.operations.filter(item=>item.operation==='accept').length,0);
    const accepted=f.page.waitForResponse(response=>new URL(response.url()).pathname==='/api/accept');
    await panel.getByRole('button',{name:'Add media',exact:true}).click();
    assert.equal((await accepted).status(),200);
    await f.page.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    assert.ok((await f.page.locator('[data-media-object] img').getAttribute('src'))?.startsWith('blob:'));
    await button('Open photo viewer').click();
    const viewer=f.page.locator('[data-media-viewer]');
    await viewer.locator('[data-image-state="ready"]').waitFor();
    await viewer.getByRole('button',{name:'Zoom in',exact:true}).click();
    assert.equal(await viewer.locator('[data-media-zoom]').innerText(),'200%');
    await button('Close media viewer').click(); await viewer.waitFor({state:'hidden'});
    await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    await f.page.locator('[data-media-grid-item]').waitFor();
    await f.page.locator('[data-media-grid-item]').click();
    await f.page.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    const records=await f.host.session.read((await f.host.session.begin(Journeys.readImages.id)).id);
    assert.equal(records.length,1);
    const detail=await f.host.session.read((await f.host.session.begin(Journeys.readImages.id,records[0]!.id)).id);
    assert.equal(detail[0]?.facts.title,'');
    await f.page.reload();
    if(width<1024) await button('Show navigation').click();
    await button('Media').click(); await f.page.locator('[data-media-grid-item]').click();
    await f.page.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    assert.equal(f.operations.filter(item=>item.operation==='accept').length,1);
    await settleMotion(f.page); assert.deepEqual(f.errors,[]);
    await f.screenshot(`private-media-${width}`);
  } finally {await f.close();}
});
