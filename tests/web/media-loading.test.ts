import assert from 'node:assert/strict';
import test from 'node:test';
import type {Route,APIResponse} from 'playwright';
import {browserFixture,settleMotion} from './fixture.ts';
import {choosePrivateImage} from './media-ui.ts';

test('private Media clears prior pixels and ignores bytes arriving after switching subjects',async()=>{
  const f=await browserFixture(),held:{route:Route,response:APIResponse}[]=[];
  let entered!:()=>void;const requested=new Promise<void>(resolve=>entered=resolve);
  try{
    await f.page.getByRole('button',{name:'Media',exact:true}).click();
    for(const description of ['First private image','Second private image']){
      const panel=await choosePrivateImage(f.page);
      await panel.getByRole('textbox',{name:'Description',exact:true}).fill(description);
      await panel.getByRole('button',{name:'Add media',exact:true}).click();
      await panel.locator('[data-image-state="ready"]').waitFor();
      await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    }
    const records=await f.host.session.read((await f.host.session.begin('read-images')).id);
    const first=records.find(record=>record.facts.description==='First private image')!;
    const reference=(first.facts.image as {reference:string}).reference;
    const pattern=`**/api/private-images/${reference}?*`;
    await f.page.route(pattern,async route=>{const response=await route.fetch();held.push({route,response});entered();});
    await f.page.getByRole('button',{name:'Open First private image',exact:true}).click();
    await requested;
    const panel=f.page.locator('[data-adaptive-surface]'),detail=panel.locator('[data-media-object]');
    assert.equal(await detail.locator('img').count(),0,'no unrelated decoded pixels while the selected private asset is pending');
    assert.equal(await detail.getByRole('progressbar').count(),0);
    assert.equal(await detail.getByText('Loading image',{exact:true}).count(),0);
    await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    await f.page.getByRole('button',{name:'Open Second private image',exact:true}).click();
    await detail.locator('[data-image-state="ready"]').waitFor();
    const current=await detail.locator('img').getAttribute('src');
    await f.page.unroute(pattern);
    await Promise.all(held.splice(0).map(({route,response})=>route.fulfill({response}).catch(()=>{})));
    await settleMotion(f.page);
    assert.equal(await detail.locator('img').getAttribute('alt'),'Second private image');
    assert.equal(await detail.locator('img').getAttribute('src'),current,'a late former subject cannot replace the active image');
    assert.deepEqual(f.errors,[]);
  }finally{await Promise.all(held.map(({route})=>route.abort().catch(()=>{})));await f.close();}
});
