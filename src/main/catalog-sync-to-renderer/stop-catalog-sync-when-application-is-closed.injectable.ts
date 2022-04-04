/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import catalogSyncToRendererInjectable from "./catalog-sync-to-renderer.injectable";
import { onApplicationCloseInjectionToken } from "../start-main-application/on-application-close/on-application-close-injection-token";

const stopCatalogSyncWhenApplicationIsClosedInjectable = getInjectable({
  id: "stop-catalog-sync-when-application-is-closed",

  instantiate: (di) => {
    const catalogSyncToRenderer = di.inject(catalogSyncToRendererInjectable);

    return {
      run: () => {
        catalogSyncToRenderer.stop();
      },
    };
  },

  injectionToken: onApplicationCloseInjectionToken,
});

export default stopCatalogSyncWhenApplicationIsClosedInjectable;
