import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from 'desert-sdk/src/index.ts';
import {Pool} from 'pg';
import {openLocalController} from 'desert-sdk/src/local.ts';
import {postgresCluster} from 'desert-sdk/src/testing/postgres-cluster.ts';
import {tasksTestProduct} from './support/tasks-host.ts';
import {storedObjects,storedTable} from 'desert-sdk/src/testing/stored-objects.ts';

test('projects persist names/colors and tasks associate only identity-owned project IDs', {timeout:120000}, async()=>{
  const cluster=postgresCluster(),database=await cluster.database();
  const application=compile(tasksTestProduct()),projectTable=storedTable(application,'project');
  const controller=await openLocalController(application,{...database,roles:['tasks']});
  const admin=new Pool({host:database.socketDirectory,user:database.user,database:database.database});
  try{
    const owner=await controller.identities.issue('Project owner'),other=await controller.identities.issue('Other identity');
    const human=controller.connect(owner.token,'human'),foreign=controller.connect(other.token,'human');
    const create=await human.prepare((await human.begin('create-project')).id,{name:'Personal',color:'rose'});
    assert.equal((await storedObjects(admin,application)).length,0);
    const project=await human.accept(create.id,create.confirmationDigest);
    assert.deepEqual(await human.accept(create.id,create.confirmationDigest),project,'same confirmation creates no duplicate');
    assert.deepEqual(await human.read((await human.begin('read-projects')).id),[{id:project.object.id,version:1,facts:{name:'Personal',color:'rose'}}]);
    assert.deepEqual(await foreign.read((await foreign.begin('read-projects')).id),[]);
    const input={title:'A task',body:'',projects:[project.object.id]};
    for(const projects of [['Personal'],['10000000-0000-4000-8000-000000000000'],[project.object.id,project.object.id]]){
      await assert.rejects(human.prepare((await human.begin('create-task')).id,{...input,projects}));
    }
    await assert.rejects(foreign.prepare((await foreign.begin('create-task')).id,input),/NOT_FOUND/);
    const task=await human.prepare((await human.begin('create-task')).id,input);
    // Fault injection in an isolated test database proves acceptance rechecks target ownership.
    await admin.query(`UPDATE ${projectTable} SET "owner"=$1 WHERE "id"=$2`,[other.id,project.object.id]);
    await assert.rejects(human.accept(task.id,task.confirmationDigest),/NOT_FOUND/);
    assert.equal(await human.receipt(task.id),null);
    await admin.query(`UPDATE ${projectTable} SET "owner"=$1 WHERE "id"=$2`,[owner.id,project.object.id]);
    const saved=await human.accept(task.id,task.confirmationDigest);
    const facts=(await human.read((await human.begin('read-tasks',saved.object.id)).id))[0]!.facts;
    assert.deepEqual(facts.projects,[project.object.id]);
    assert.equal((await storedObjects(admin,application)).length,2);
  }finally{await admin.end();await controller.close();cluster.dispose();}
});
