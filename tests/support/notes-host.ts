import { Pool } from "pg";
import { compile } from "desert-sdk/src/index.ts";
import { openLocalController } from "desert-sdk/src/local.ts";
import type { Receipt, StoredObject } from "desert-sdk/src/local/types.ts";
import { postgresCluster } from "desert-sdk/src/testing/postgres-cluster.ts";
import { NotesController } from "../../src/modules/notes/notes.dependencies.ts";
import { VOID, VoidProduct } from "../../src/void.product.ts";

// Test-only host: the SDK creates and removes its own temporary cluster.
// No existing database, product store or privileged runtime is exposed to VOID.
export async function openNotesTestHost() {
  const application = compile(VoidProduct);
  const cluster = postgresCluster();
  let controller: Awaited<ReturnType<typeof openLocalController>> | undefined;
  let observer: Pool | undefined;
  async function disconnect() {
    const previous = controller;
    controller = undefined;
    const pool = observer;
    observer = undefined;
    try { await previous?.close(); } finally { await pool?.end(); }
  }
  try {
    const database = await cluster.database();
    async function connect() {
      controller = await openLocalController(application, { ...database, roles: [NotesController.id] });
      observer = new Pool({ host: database.socketDirectory, database: database.database, user: database.user });
      observer.on("error", () => {});
    }
    await connect();
    return {
      get controller() {
        if (!controller) throw new Error("TEST_HOST_NOT_CONNECTED");
        return controller;
      },
      async snapshot() {
        if (!observer) throw new Error("TEST_HOST_NOT_CONNECTED");
        const objects = await observer.query<StoredObject>(
          "SELECT id, object_type, version, facts FROM desert_objects ORDER BY id");
        const receipts = await observer.query<{ result: Receipt }>(
          "SELECT result FROM desert_receipts ORDER BY intent_id");
        return { objects: objects.rows, receipts: receipts.rows.map(row => row.result) };
      },
      async restart() {
        await disconnect();
        cluster.stop();
        cluster.start();
        await connect();
      },
      async close() {
        try { await disconnect(); } finally { cluster.dispose(); }
      },
    };
  } catch (error) {
    try { await disconnect(); } finally { cluster.dispose(); }
    throw error;
  }
}
