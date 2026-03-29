import "./style.css";

import { registerDocumentationComponents } from "./components";
import {
  createDocumentationRoutes,
  createDocumentationRouteMap,
  documentationNavigationItems,
  getDocumentationNavigationItems,
  getDocumentationRouteMeta,
  getDocumentationShellCopy,
  getDocumentationRouteMap,
  installDocumentationRouteMap,
  withDocumentationBase,
  withDocumentationBaseStyle,
} from "./documentation-config";
import { registerPages } from "./pages";

export {
  createDocumentationRoutes,
  createDocumentationRouteMap,
  documentationNavigationItems,
  getDocumentationNavigationItems,
  getDocumentationRouteMeta,
  getDocumentationShellCopy,
  getDocumentationRouteMap,
  installDocumentationRouteMap,
  withDocumentationBase,
  withDocumentationBaseStyle,
};

export const registerDocumentation = (): void => {
  registerDocumentationComponents();
  registerPages();
};
