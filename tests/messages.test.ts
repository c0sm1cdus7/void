// Plan §14: VOID writes every human sentence once, in src/messages/en.json; declarations name it through the generated
// src/messages/keys.ts. The SDK source gate refuses a literal label in a view (N56) and a keys module that drifted.
import assert from "node:assert/strict";
import test from "node:test";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertProductSource } from "desert-sdk/src/authoring/index.ts";
import { VoidViewProgram } from "../src/void.product.ts";
import { Messages, m } from "../src/messages/keys.ts";

const source = fileURLToPath(new URL("../src", import.meta.url));
const notes = "modules/notes/views/notesHome.view.ts";

async function withCopy(mutate: (root: string) => Promise<void>, check: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), "void-messages-"));
  try { await cp(source, root, { recursive: true }); await mutate(root); await check(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}
const edit = (root: string, path: string, from: string, to: string) => async () => {
  const text = await readFile(join(root, path), "utf8");
  assert.ok(text.includes(from), `MUTATION_ANCHOR_MISSING: ${path}: ${from}`);
  await writeFile(join(root, path), text.replace(from, to));
};

test("N56 a literal label in a VOID view is refused by the source gate", async () => {
  await withCopy(root => edit(root, notes, "label: m.notes.createNote", 'label: "Notes"')(), async root =>
    assert.rejects(assertProductSource(root), /^Error: LITERAL_TEXT: modules\/notes\/views\/notesHome\.view\.ts:\d+: label is the literal "Notes"/));
});

test("a sentence changed in en.json without regenerating keys.ts is MESSAGE_DERIVATION", async () => {
  await withCopy(root => edit(root, "messages/en.json", '"title": "Notes"', '"title": "My notes"')(), async root =>
    assert.rejects(assertProductSource(root), /^Error: MESSAGE_DERIVATION: messages\/keys\.ts differs from the messages bundles; run `npm run messages:write`$/));
});

test("the compiled program reads the catalog's English, unchanged from the literals it replaced", () => {
  const home = VoidViewProgram.views.find(view => view.id === "notes")?.content[0];
  assert.deepEqual(home, { kind: "header", id: "content.0", title: "Notes", subtitle: "Your private notes." });
  assert.equal(Messages.bundle("en").text(m.notes.title), "Notes");
  assert.deepEqual(VoidViewProgram.navigation.map(item => item.group), ["Explore", "Explore", "Explore", "Explore", "Settings", "Settings", "Settings", "Developer"]);
  assert.equal(VoidViewProgram.label, "VOID");
});
