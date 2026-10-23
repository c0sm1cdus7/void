import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { IdentityView } from "../views/identity.view.ts";

export const InspectIdentity = {
  id: "inspect-identity", kind: "presentation", view: IdentityView,
  outputs: [{ ...viewOutput(IdentityView, "lock"), action: { kind: "lock" } }],
} satisfies ViewJourney;
