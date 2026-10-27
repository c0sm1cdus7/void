// VOID's message catalog extended with the sentences only test witnesses declare (plan §14). The product's own sentences
// stay in src/messages/en.json; a witness never adds to them.
import { messageCatalog } from "desert-sdk/src/index.ts";
import { Messages } from "../../src/messages/keys.ts";

export const WitnessMessages = messageCatalog({ en: { ...Messages.bundles.en,
  witness: { tasksProduct: "Tasks witness", attention: "Needs your attention" } } } as const);
export const witness = WitnessMessages.m.witness;
