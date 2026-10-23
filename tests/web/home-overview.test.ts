import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { VoidViewProgram } from '../../src/void.product.ts';
import { CreateNote } from '../../src/modules/notes/journeys/createNote.journey.ts';
import { CreateTask } from '../../src/modules/tasks/journeys/createTask.journey.ts';
import { browserFixture, settleMotion } from './fixture.ts';

test('Home unifies authoritative attention and shows a read-backed module widget at wide and narrow widths',async()=>{
  const f=await browserFixture();
  try {
    const controllerCalls:string[]=[];
    f.page.on('request',request=>{
      const operation=new URL(request.url()).pathname;
      if(['/api/begin','/api/read','/api/prepare','/api/accept'].includes(operation))controllerCalls.push(operation);
    });
    for(const title of ['Design ideas','Next steps']){
      const run=await f.host.session.begin(CreateNote.id);
      const intent=await f.host.session.prepare(run.id,{title,body:'A private saved note.'});
      await f.host.session.accept(intent.id,intent.confirmationDigest);
    }
    for(const title of ['Review the VOID walkthrough','Organize media collections']){
      const run=await f.host.session.begin(CreateTask.id);
      const intent=await f.host.session.prepare(run.id,{title,body:'',projects:[]});
      const receipt=await f.host.session.accept(intent.id,intent.confirmationDigest);
      if(title==='Organize media collections'){
        const complete=await f.host.session.begin('complete-task',receipt.object.id);
        const completed=await f.host.session.prepare(complete.id,{});
        await f.host.session.accept(completed.id,completed.confirmationDigest);
      }
    }
    const guided=VoidViewProgram.journeys.find(journey=>journey.id==='guided-note');
    assert.ok(guided?.kind==='activity');
    const pending=await f.host.session.activityCreate(randomUUID(),guided.activity);
    await f.page.reload();
    const main=f.page.locator('[role="main"][data-destination="home"]');
    const attention=main.getByRole('group',{name:'Attention',exact:true});
    const widgets=main.getByRole('group',{name:'Widgets',exact:true});
    const widget=widgets.getByRole('button',{name:'Open Tasks',exact:true});
    await attention.getByRole('button',{name:/Guided note.*Continue where you left off/}).waitFor();
    await widget.locator('.widget-total').waitFor();
    for(const width of [1600,390]){
      await f.page.setViewportSize({width,height:1000});
      await settleMotion(f.page);
      assert.equal(await main.locator('[data-attention-indicator]').count(),1,
        'only the authoritative pending activity demands attention; Open does not');
      assert.equal(await widgets.locator('[data-attention-indicator]').count(),0);
      assert.equal(await main.getByRole('group',{name:'Open tasks',exact:true}).count(),0);
      assert.equal(await main.getByRole('group',{name:'Notes',exact:true}).count(),0);
      assert.doesNotMatch(await main.innerText(),/Design ideas|Next steps|Review the VOID walkthrough|Organize media collections/);
      assert.match(await widget.innerText(),/1 Open/);
      assert.match(await widget.innerText(),/1 Completed/);
      assert.equal(await widget.locator('[data-segment]').count(),2,'the widget has an aggregate graphic, not an object list');
      const geometry=await main.evaluate(element=>{
        const group=(label:string)=>[...element.querySelectorAll('fieldset')].find(node=>node.querySelector('legend')?.textContent===label)!.getBoundingClientRect();
        return {widgets:group('Widgets').toJSON(),attention:group('Attention').toJSON()};
      });
      assert.ok(geometry.widgets.top>=geometry.attention.bottom);
      assert.ok((await widget.boundingBox())!.width<=352,'a widget stays bounded rather than filling the page');
      assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await f.screenshot(`home-populated-${width}`);
    }
    assert.deepEqual((await f.host.session.activityList()).items.map(item=>item.id),[pending.id],
      'viewing Home never acknowledges attention');
    await f.page.route('**/api/availability',route=>route.abort('connectionrefused'));
    await widget.getByText('Offline · Last loaded summary',{exact:true}).waitFor();
    assert.equal(await widget.isEnabled(),true,'offline widgets still open cached read destinations');
    assert.match(await widget.innerText(),/1 Open/);
    assert.match(await widget.innerText(),/1 Completed/);
    assert.equal(await attention.getByRole('button',{name:/Guided note.*Continue where you left off/}).isDisabled(),true,
      'cached attention remains visible, but cannot resume without controller authority');
    await f.screenshot('home-cached-offline-390');
    const before=controllerCalls.length;
    await widget.click();
    const tasks=f.page.locator('[role="main"][data-destination="tasks"]');
    await tasks.waitFor();
    assert.equal(await f.page.getByRole('dialog').count(),0,'widget activation opens its module, not an object');
    const row=tasks.getByRole('button',{name:/Review the VOID walkthrough/});
    await row.waitFor();
    assert.equal(await row.isDisabled(),true,'cached objects remain readable without allowing uncached selection');
    assert.deepEqual(controllerCalls.slice(before),[],'local offline browsing never begins, reads or submits a controller operation');
    await f.screenshot('home-widget-destination-cached-offline-390');
    assert.equal(f.operations.filter(operation=>operation.operation==='prepare'||operation.operation==='accept').length,0);
    assert.deepEqual(f.errors,[]);
  }finally{await f.close();}
});
