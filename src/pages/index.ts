import { Core } from "@koppajs/koppajs-core";

import apiPage from "./api-page.kpa";
import apiPageI18n from "./api-page-i18n.kpa";
import examplesPage from "./examples-page.kpa";
import examplesPageI18n from "./examples-page-i18n.kpa";
import gettingStartedPage from "./getting-started-page.kpa";
import gettingStartedPageI18n from "./getting-started-page-i18n.kpa";
import guidesPage from "./guides-page.kpa";
import guidesPageI18n from "./guides-page-i18n.kpa";
import homePage from "./home-page.kpa";
import homePageI18n from "./home-page-i18n.kpa";
import notFoundPage from "./not-found-page.kpa";
import notFoundPageI18n from "./not-found-page-i18n.kpa";
import packagesPage from "./packages-page.kpa";
import packagesPageI18n from "./packages-page-i18n.kpa";
import toolingPage from "./tooling-page.kpa";
import toolingPageI18n from "./tooling-page-i18n.kpa";

export function registerPages(): void {
  Core.take(homePage, "documentation-home-page-de");
  Core.take(homePageI18n, "documentation-home-page");
  Core.take(gettingStartedPage, "documentation-getting-started-page-de");
  Core.take(gettingStartedPageI18n, "documentation-getting-started-page");
  Core.take(guidesPage, "documentation-guides-page-de");
  Core.take(guidesPageI18n, "documentation-guides-page");
  Core.take(examplesPage, "documentation-examples-page-de");
  Core.take(examplesPageI18n, "documentation-examples-page");
  Core.take(apiPage, "documentation-api-page-de");
  Core.take(apiPageI18n, "documentation-api-page");
  Core.take(toolingPage, "documentation-tooling-page-de");
  Core.take(toolingPageI18n, "documentation-tooling-page");
  Core.take(packagesPage, "documentation-packages-page-de");
  Core.take(packagesPageI18n, "documentation-packages-page");
  Core.take(notFoundPage, "documentation-not-found-page-de");
  Core.take(notFoundPageI18n, "documentation-not-found-page");
}
