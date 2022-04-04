/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onRootFrameRenderInjectionToken } from "../start-main-application/on-root-frame-render/on-root-frame-render-injection-token";
import catalogSyncToRendererInjectable from "./catalog-sync-to-renderer.injectable";

const startCatalogSyncWhenRootFrameIsRenderedInjectable = getInjectable({
  id: "start-catalog-sync-when-root-frame-is-rendered",

  instantiate: (di) => {
    const catalogSyncToRenderer = di.inject(catalogSyncToRendererInjectable);

    return {
      run: () => {
        catalogSyncToRenderer.start();
      },
    };
  },

  injectionToken: onRootFrameRenderInjectionToken,
});

export default startCatalogSyncWhenRootFrameIsRenderedInjectable;
