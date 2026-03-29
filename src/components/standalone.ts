import { Core } from "@koppajs/koppajs-core";

import appShell from "./app-shell.kpa";

export function registerStandaloneShell(): void {
  Core.take(appShell, "documentation-standalone-shell");
}
