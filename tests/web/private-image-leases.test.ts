import assert from 'node:assert/strict';
import test from 'node:test';
import { browserFixture } from './fixture.ts';
import { choosePrivateImage } from './media-ui.ts';

test('private detail and viewer revoke resolved pixels when controller authority is unavailable',async()=>{
  const f=await browserFixture();
  try {
    const button=(name:string)=>f.page.getByRole('button',{name,exact:true});
    await button('Media').click(); const panel=await choosePrivateImage(f.page);
    await panel.getByRole('button',{name:'Add media',exact:true}).click();
    const detail=f.page.locator('[data-media-object]');
    await detail.locator('[data-image-state="ready"]').waitFor(); await button('Open photo viewer').click();
    const stage=f.page.locator('[data-media-viewer] [data-media-stage]');
    await stage.locator('[data-image-state="ready"]').waitFor();
    const urls=await f.page.locator('[data-media-object] img,[data-media-stage] img').evaluateAll(images=>images.map(image=>image.getAttribute('src')!));
    assert.equal(urls.length,2); assert.ok(urls.every(url=>url.startsWith('blob:')));
    const decode=(url:string)=>f.page.evaluate(async source=>{const image=new Image();image.src=source;try{await image.decode();return true;}catch{return false;}},url);
    for(const url of urls) assert.equal(await decode(url),true);
    await f.page.route('**/api/availability',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'TEST_UNAVAILABLE'})}));
    await detail.locator('img').waitFor({state:'detached'}); await stage.locator('img').waitFor({state:'detached'});
    for(const url of urls) assert.equal(await decode(url),false);
    await f.page.unroute('**/api/availability');
    await detail.locator('[data-image-state="ready"]').waitFor(); await stage.locator('[data-image-state="ready"]').waitFor();
    assert.equal(f.operations.filter(item=>item.operation==='accept').length,1);
    await button('Close media viewer').click(); await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    assert.deepEqual(f.errors,[]);
  } finally {await f.close();}
});
