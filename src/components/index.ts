import { Core } from "@koppajs/koppajs-core";

import documentationLayout from "./documentation-layout.kpa";

export function registerDocumentationComponents(): void {
  Core.take(documentationLayout, "documentation-layout");
}
