import assert from 'node:assert/strict';
import type { Page } from 'playwright';
import { privateImageFile } from './media-fixture.ts';
import { settleMotion } from './fixture.ts';

export async function choosePrivateImage(page: Page) {
  const choosing = page.waitForEvent('filechooser');
  await page.getByRole('button',{name:'Add media',exact:true}).click();
  await (await choosing).setFiles(await privateImageFile());
  const panel = page.locator('[data-adaptive-surface]');
  await panel.waitFor();
  assert.equal(await panel.getAttribute('data-presentation'),'transient');
  assert.equal(await panel.getByRole('textbox',{name:'Title',exact:true}).count(),0);
  return panel;
}

export async function mediaAction(page: Page, name: string) {
  await settleMotion(page);
  const top = page.locator('[data-adaptive-surface] [data-surface-slot="top"]');
  const direct = top.getByRole('button',{name,exact:true});
  if (await direct.isVisible()) return direct;
  await top.getByRole('button',{name:'More actions',exact:true}).click();
  return page.getByRole('button',{name,exact:true}).filter({visible:true});
}
