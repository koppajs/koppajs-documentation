import { Core } from "@koppajs/koppajs-core";

import gettingStartedPage from "./getting-started-page.kpa";
import homePage from "./home-page.kpa";
import notFoundPage from "./not-found-page.kpa";
import packagesPage from "./packages-page.kpa";
import testingPage from "./testing-page.kpa";

export function registerPages(): void {
  Core.take(homePage, "home-page");
  Core.take(gettingStartedPage, "getting-started-page");
  Core.take(packagesPage, "packages-page");
  Core.take(testingPage, "testing-page");
  Core.take(notFoundPage, "not-found-page");
}
