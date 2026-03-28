import { Core } from "@koppajs/koppajs-core";

import appShell from "./app-shell.kpa";

export function registerComponents(): void {
  Core.take(appShell, "app-shell");
}
