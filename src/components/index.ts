import { Core } from "@koppajs/koppajs-core";

import documentationLayout from "./documentation-layout.kpa";
import documentationNotFoundPage from "./documentation-not-found-page.kpa";
import documentationPage from "./documentation-page.kpa";

export function registerDocumentationComponents(): void {
  Core.take(documentationLayout, "documentation-layout");
  Core.take(documentationPage, "documentation-page");
  Core.take(documentationNotFoundPage, "documentation-not-found-page");
}
