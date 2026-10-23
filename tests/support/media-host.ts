import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compile } from "desert-sdk/src/index.ts";
import { openLocalController } from "desert-sdk/src/local.ts";
import { postgresCluster } from "desert-sdk/src/testing/postgres-cluster.ts";
import { VOID, VoidProduct } from "../../src/void.product.ts";
import { Dependencies, Journeys } from "../../src/modules.ts";
import { privateImages } from "../../scripts/private-images.ts";
import { privateImageFile } from "../web/media-fixture.ts";

export async function openMediaTestHost() {
  const cluster = postgresCluster();
  const directory = await mkdtemp(join(tmpdir(), "void-media-lifecycle-"));
  let host: Awaited<ReturnType<typeof openLocalController>> | undefined;
  async function close() {
    try { await host?.close(); } finally { cluster.dispose(); await rm(directory, { recursive: true, force: true }); }
  }
  try {
    host = await openLocalController(compile(VoidProduct), { ...await cluster.database(),
      roles: [Dependencies.media.id], privateImages: privateImages(directory) });
    const owner = await host.identities.issue("Private image owner");
    const human = host.connect(owner.token, "human"), agent = host.connect(owner.token, "agent");
    const foreign = host.connect((await host.identities.issue("Other image identity")).token, "human");
    const { buffer } = await privateImageFile();
    const run = await human.begin(Journeys.importImage.id);
    const reservation = await human.reserveImage(run.id, "image", buffer.length);
    const asset = await human.uploadImage(run.id, "image", reservation.reference, [buffer]);
    const prepared = await human.prepare(run.id, { image: asset, fit: "fill", description: "", collections: [] });
    const receipt = await human.accept(prepared.id, prepared.confirmationDigest);
    return { host, human, agent, foreign, asset, original: buffer, id: receipt.object.id, close };
  } catch (error) { await close(); throw error; }
}
