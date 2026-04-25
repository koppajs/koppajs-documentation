import "./style.css";

import { registerDocumentationComponents } from "./components";
import { installCodeBlockCopyButtons } from "./code-blocks";
import {
  createDocumentationRouteMap,
  createDocumentationRoutes,
  documentationNavigationItems,
  getDocumentationNavigationItems,
  getDocumentationRouteMap,
  getDocumentationRouteMeta,
  getDocumentationShellCopy,
  installDocumentationRouteMap,
  normalizeDocumentationBasePath,
  resolveDocumentationPath,
  withDocumentationBase,
  withDocumentationBaseStyle,
} from "./documentation-config";
import { ecosystemPackages } from "./ecosystem";
import { normalizeRedirectedRouteUrl } from "./router-runtime";

export {
  createDocumentationRouteMap,
  createDocumentationRoutes,
  documentationNavigationItems,
  ecosystemPackages,
  getDocumentationNavigationItems,
  getDocumentationRouteMap,
  getDocumentationRouteMeta,
  getDocumentationShellCopy,
  installCodeBlockCopyButtons,
  installDocumentationRouteMap,
  normalizeDocumentationBasePath,
  normalizeRedirectedRouteUrl,
  resolveDocumentationPath,
  withDocumentationBase,
  withDocumentationBaseStyle,
};

export const registerDocumentation = (): void => {
  registerDocumentationComponents();
};
