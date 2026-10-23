import assert from 'node:assert/strict';
import test from 'node:test';
import {browserFixture,settleMotion} from './fixture.ts';
import {choosePrivateImage} from './media-ui.ts';
import {privateImageFile} from './media-fixture.ts';
import {Journeys} from '../../src/modules.ts';

test('Media has one private library and its only creation entry opens the filtered native picker',async()=>{
  const f=await browserFixture();
  try{
    const button=(name:string)=>f.page.getByRole('button',{name,exact:true});
    for(const name of ['Home','Notes','Media','Visual catalog'])assert.equal(await button(name).count(),1);
    await button('Media').click();await settleMotion(f.page);
    await f.page.getByRole('main',{name:'Media',exact:true}).waitFor();
    assert.equal(await f.page.getByRole('heading',{name:'Media',exact:true,level:1}).count(),1);
    assert.equal(await f.page.locator('[data-media-library],[data-media-grid-item]').count(),0,'no public demo records enter the private library');
    assert.equal(await button('Add media').count(),1);
    assert.equal(await button('My images').count(),0);
    const choosing=f.page.waitForEvent('filechooser');await button('Add media').click();
    const chooser=await choosing;
    assert.equal(await chooser.element().getAttribute('accept'),'image/jpeg,image/png,image/webp,video/mp4,audio/mp4,audio/mpeg,audio/wav');
    await chooser.element().evaluate(input=>input.dispatchEvent(new Event('cancel')));
    assert.equal(await f.page.locator('[data-adaptive-surface]').count(),0);
    assert.equal(f.operations.filter(item=>item.operation!=='begin').length,0);
    await button('Notes').click();await f.page.getByRole('main',{name:'Notes',exact:true}).waitFor();
    assert.deepEqual(await f.records(),[]);assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});

test('the real Media library uses three wide tiles and one narrow column without overflow',async()=>{
  const f=await browserFixture();
  try{
    const file=await privateImageFile();
    for(let index=0;index<3;index++){
      const run=await f.host.session.begin(Journeys.importImage.id);
      const reserved=await f.host.session.reserveImage(run.id,'image',file.buffer.length);
      const image=await f.host.session.uploadImage(run.id,'image',reserved.reference,[file.buffer]);
      const prepared=await f.host.session.prepare(run.id,{image,fit:'fill',description:'',collections:[]});
      await f.host.session.accept(prepared.id,prepared.confirmationDigest);
    }
    await f.page.getByRole('button',{name:'Media',exact:true}).click();
    const tiles=f.page.locator('[data-media-grid-item]').filter({visible:true});
    await tiles.nth(2).waitFor();
    for(const width of [1600,390]){
      await f.page.setViewportSize({width,height:1100});await settleMotion(f.page);
      await f.page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-media-grid-item] [data-media-image]')).every(image=>image.getAttribute('data-image-state')==='ready'));
      const flow=f.page.locator('[data-content-layout="gallery"]').filter({visible:true});
      const boxes=await tiles.evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width};}));
      assert.equal(boxes.length,3);
      if(width===1600){
        assert.ok((await flow.boundingBox())!.width>800);
        assert.ok(boxes.every(box=>Math.abs(box.y-boxes[0]!.y)<1));
        assert.ok(boxes[0]!.width>=288,'gallery tiles keep the approved comfortable measure');
      }else{
        assert.ok(boxes.every(box=>Math.abs(box.x-boxes[0]!.x)<1));
        assert.ok(boxes[1]!.y>boxes[0]!.y&&boxes[2]!.y>boxes[1]!.y);
        assert.equal(await flow.evaluate(element=>element.scrollWidth<=element.clientWidth+1),true);
      }
      await f.screenshot(`media-gallery-${width}`);
    }
    assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});

test('a saved note survives private media import, viewer activity, navigation and reload',async()=>{
  const f=await browserFixture();
  try{
    const button=(name:string)=>f.page.getByRole('button',{name,exact:true});
    await button('Notes').click();await button('Create note').click();
    await f.page.getByRole('textbox',{name:'Title',exact:true}).fill('Notes and Media coexist');
    await f.page.getByRole('textbox',{name:'Content',exact:true}).fill('This exact content survives media navigation.');
    await button('Save note').click();await f.page.getByRole('textbox',{name:'Title',exact:true}).waitFor({state:'hidden'});
    const notes=await f.records();
    await f.page.locator('[data-adaptive-surface]').getByRole('button',{name:'Close',exact:true}).first().click();
    await button('Media').click();const panel=await choosePrivateImage(f.page);
    await panel.getByRole('button',{name:'Add media',exact:true}).click();
    await panel.locator('[data-image-state="ready"]').waitFor();
    await button('Open photo viewer').click();await f.page.locator('[data-media-viewer] [data-image-state="ready"]').waitFor();
    await f.page.keyboard.press('Escape');await f.page.locator('[data-media-viewer]').waitFor({state:'hidden'});
    await panel.getByRole('button',{name:'Close',exact:true}).first().click();
    const writes=f.operations.filter(item=>item.operation!=='begin').length;
    await button('Notes').click();await button('Notes and Media coexist').click();
    await f.page.getByText('This exact content survives media navigation.',{exact:true}).waitFor();
    await f.page.reload();await button('Notes').click();await button('Notes and Media coexist').click();
    await f.page.getByText('This exact content survives media navigation.',{exact:true}).waitFor();
    assert.deepEqual(await f.records(),notes);
    assert.equal(f.operations.filter(item=>item.operation!=='begin').length,writes);
    assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});
