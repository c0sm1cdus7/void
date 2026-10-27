import assert from "node:assert/strict";
import test from "node:test";
import { ResolvedNodes } from "desert-sdk/src/interaction/catalog.ts";
import { sharedIndexOwners } from "desert-sdk/src/svelte/infra/shared-purpose.ts";
import { browserFixture, settleMotion } from "./fixture.ts";

test("built Visual bank publishes its index, real grouped facts and responsive state inspection without product mutations", async () => {
  const f = await browserFixture();
  try {
    await f.page.getByRole("button", {name:"Visual catalog",exact:true}).click();
    const main = f.page.locator('[data-catalog-content][role="main"]');
    const title = main.locator('[data-place-header] [data-place-title]');
    const toolbar = main.locator(':scope > [data-toolbar="top"]');
    const back = toolbar.getByRole('button',{name:'Back',exact:true});
    assert.equal(await title.innerText(),'Visual catalog');
    const index = main.locator('[data-catalog-index]');
    await index.waitFor();
    assert.equal(await main.locator('[data-catalog-entry]:visible').count(),0);
    for (const group of ResolvedNodes.groups) {
      const stack=index.getByRole('group',{name:group.title,exact:true});
      assert.equal(await stack.locator('[data-grouped-panel]').count(),1);
      assert.equal(await stack.locator('[data-destination]').count(),
        ResolvedNodes.entries.filter(entry=>entry.inspection.group===group.id).length+sharedIndexOwners(group.id).length);
    }
    assert.equal(await main.getByRole('navigation',{name:'Catalog navigation'}).count(),0);
    assert.deepEqual((await index.locator('.place-stack > legend:visible').allTextContents()).map(text=>text.trim()),['Foundations','Compositions']);
    assert.equal(await index.getByRole('button',{name:'Button',exact:true}).count(),1);
    assert.equal(await index.getByRole('button',{name:'Avatar',exact:true}).count(),1);
    assert.equal(await index.getByRole('button',{name:'Image',exact:true}).count(),1);
    const fact=index.locator('[data-destination="fact"]');
    await fact.click();
    const opener=main.getByRole('button',{name:'Fact row',exact:true});
    await opener.click();
    assert.equal(await title.innerText(),'Fact row','catalog details replace the destination content identity');
    assert.match(await main.locator('[data-place-header] [data-place-subtitle]').innerText(),/capitalized label/);
    assert.equal(await back.count(),1,'Back belongs to the destination toolbar');
    assert.equal(await main.locator('[data-shared-owner-catalog] > [data-piece="toolbar"]').count(),0);
    const specimen=main.locator('[data-owner-specimen="FactRow"]');
    await specimen.waitFor();
    assert.equal(await specimen.locator('.bank-stack').count(),1,'related facts form one pane');
    assert.equal(await specimen.locator('.fact-row').count(),5,'catalog explicitly demonstrates empty and unknown as well as populated facts');
    for (const width of [1600,390,320]) {
      await f.page.setViewportSize({width,height:900});
      await f.page.evaluate(scale=>document.documentElement.style.setProperty('--text-scale',scale),width===320?'2':'1');
      await settleMotion(f.page);
      const rows=await specimen.locator('.fact-row').evaluateAll(elements=>elements.map(element=>{
        const label=element.querySelector('dt')!,value=element.querySelector('dd')!,a=label.getBoundingClientRect(),b=value.getBoundingClientRect();
        const group=element.closest('.bank-stack')!,groupStyle=getComputedStyle(group),rowStyle=getComputedStyle(element);
        return {labelLeft:a.left,labelRight:a.right,labelBottom:a.bottom,valueLeft:b.left,valueRight:b.right,valueTop:b.top,
          reflows:group.clientWidth<=14*parseFloat(groupStyle.fontSize),columns:rowStyle.gridTemplateColumns.split(' ').length,
          contentRight:element.getBoundingClientRect().right-parseFloat(rowStyle.paddingRight)-parseFloat(rowStyle.borderRightWidth),
          align:getComputedStyle(value).textAlign,wrap:getComputedStyle(value).textWrap,
          labelOverflow:label.scrollWidth-label.clientWidth,valueOverflow:value.scrollWidth-value.clientWidth};
      }));
      for (const row of rows) {
        if (row.reflows) {
          assert.equal(row.columns,1,'narrow fact groups use one readable column');
          assert.ok(row.valueTop>=row.labelBottom,'the value follows its label vertically without overlap');
          assert.ok(Math.abs(row.valueLeft-row.labelLeft)<=1 && Math.abs(row.valueRight-row.labelRight)<=1,
            'reflowed label and value share the full reading width');
        } else {
          assert.equal(row.columns,2,'wide fact groups retain exactly two columns');
          assert.ok(row.valueLeft>=row.labelRight,'wide facts occupy the right column');
        }
        assert.ok(Math.abs(row.valueRight-row.contentRight)<=1,'every value keeps the same end-aligned reading edge');
        assert.equal(row.align,'end'); assert.equal(row.wrap,'balance');
        assert.ok(row.labelOverflow<=1 && row.valueOverflow<=1,'neither fact column clips text horizontally');
      }
      assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      // The long fixture can exceed the viewport at 200%; center-scrolling it
      // captures the middle of wrapped words, not a meaningful reading start.
      await specimen.locator('.fact-row').first().evaluate(element=>element.scrollIntoView({block:'start'}));
      await f.page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
      await settleMotion(f.page);
      await specimen.locator('.fact-row').first().evaluate(element=>{
        const viewport=element.closest<HTMLElement>('[data-catalog-scroll]')!;
        const protection=parseFloat(getComputedStyle(viewport).getPropertyValue('--reading-protection-end')) || 0;
        viewport.scrollTop+=element.getBoundingClientRect().top-viewport.getBoundingClientRect().top-protection-16;
      });
      await f.page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
      await f.screenshot(`visual-bank-facts-${width}`);
    }
    await back.click();
    assert.equal(await title.innerText(),'Fact');
    assert.ok(await opener.evaluate(element=>element===document.activeElement));
    await back.click();
    assert.equal(await title.innerText(),'Visual catalog');
    assert.ok(await fact.evaluate(element=>element===document.activeElement));
    await f.page.evaluate(()=>document.documentElement.style.setProperty('--text-scale','1'));
    await index.locator('[data-destination="input.text"]').click();
    assert.equal(await title.innerText(),'Text input');
    const textEntry=main.locator('[data-catalog-entry="input.text"]');
    const state=textEntry.getByRole('button',{name:/^State ·/});
    for(const width of [1600,390]) {
      await f.page.setViewportSize({width,height:900});
      await main.locator('[data-catalog-scroll]').evaluate(element=>element.scrollTo({top:0}));
      await settleMotion(f.page);
      assert.ok(await state.evaluate(element=>Boolean(element.closest('.field-well'))),
        'catalog State uses the same well owner as Appearance Text size');
      assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await f.screenshot(`visual-bank-text-input-${width}`);
    }
    await back.click();
    await index.locator('[data-destination="control.money"]').click();
    assert.equal(await title.innerText(),'Money');
    const entry=main.locator('[data-catalog-entry="control.money"]');
    await entry.getByRole('button',{name:/^State ·/}).click();
    await f.page.getByRole('option',{name:'value',exact:true}).click();
    const value=entry.locator('[data-specimen="control.money:value"]').getByRole('textbox');
    await value.fill('42,75');
    assert.equal(await value.inputValue(),'42,75');
    assert.equal(await main.locator('[data-catalog-entry]:visible').count(),1);
    await back.click();
    await index.locator('[data-destination="Flow"]').click();
    assert.equal(await title.innerText(),'Content flow');
    const flow=main.locator('[data-owner-specimen="Flow"]');
    await flow.getByRole('button',{name:/^Layout ·/}).click();
    await f.page.getByRole('option',{name:'Gallery',exact:true}).click();
    assert.equal(await flow.locator('[data-content-layout="gallery"]').count(),1);
    assert.equal(await flow.locator('[data-media-grid-item]').count(),3);
    assert.equal(await flow.locator('[data-media-collection-card]').count(),2);
    assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    for(const width of [1600,320]) {
      await f.page.setViewportSize({width,height:900});
      await settleMotion(f.page);
      await flow.locator('[data-media-grid]').evaluate(element=>{
        const viewport=element.closest<HTMLElement>('[data-catalog-scroll]')!;
        const protection=parseFloat(getComputedStyle(viewport).getPropertyValue('--reading-protection-end')) || 0;
        viewport.scrollTop+=element.getBoundingClientRect().top-viewport.getBoundingClientRect().top-protection-32;
      });
      await f.screenshot(`visual-bank-gallery-${width}`);
    }
    for (const operation of f.operations) {
      assert.equal(operation.operation,'begin','catalog examples never prepare or accept a product command');
      assert.ok(['read-projects','read-notes','read-tasks'].includes(String(operation.input.journeyId)),
        'only canonical entry reads may begin; no catalog example starts a mutation');
    }
    assert.deepEqual(f.errors,[]);
  } finally {await f.close();}
});
