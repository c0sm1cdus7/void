// VOID's client installation (DESERT owner answers Q4/Q20): its human exposure speaks English (src/exposures.ts),
// so its stored text orders in English. The local hosts and the tests read this one declaration.
import { clientInstallation } from "desert-sdk/src/storage/client-installation.ts";

export const VoidInstallation = clientInstallation({ language: "en" });
