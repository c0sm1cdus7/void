import assert from 'node:assert/strict';
import test from 'node:test';
import {browserFixture,settleMotion} from './fixture.ts';
import {choosePrivateImage} from './media-ui.ts';

for(const width of [390,1600])test(`Media search finds its displayed description without inventing image titles at ${width}px`,async()=>{
  const f=await browserFixture();
  try{
    await f.page.getByRole('button',{name:'Media',exact:true}).click();
    const panel=await choosePrivateImage(f.page);
    await panel.getByRole('textbox',{name:'Description',exact:true}).fill('Private blue landscape');
    await panel.getByRole('button',{name:'Add media',exact:true}).click();await panel.locator('[data-image-state="ready"]').waitFor();
    await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    await f.page.setViewportSize({width,height:844});await settleMotion(f.page);
    const writes=f.operations.filter(item=>item.operation!=='begin').length;
    const base=f.page.locator('[data-catalog-scroll]'),before=await base.innerText();
    await f.page.getByRole('button',{name:'Search',exact:true}).click();
    const overlay=f.page.locator('[data-catalog-search-scroll]');await overlay.waitFor();
    await f.page.getByRole('searchbox').fill('blue landscape');
    const result=overlay.locator('[data-search-result]').getByRole('button');await result.waitFor();
    assert.match(await result.innerText(),/Image/);assert.match(await result.innerText(),/Private blue landscape/);
    assert.equal(await base.innerText(),before);
    await result.click();await overlay.waitFor({state:'hidden'});
    await panel.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    assert.match((await panel.locator('[data-media-object] img').getAttribute('src'))!,/^blob:/);
    assert.equal(f.operations.filter(item=>item.operation!=='begin').length,writes);
    assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});
