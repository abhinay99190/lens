/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import * as Immer from "immer";
import { beforeApplicationIsReadyInjectionToken } from "../start-main-application.injectable";

const setupImmerInjectable = getInjectable({
  id: "setup-immer",

  instantiate: () => ({
    run: () => {
      // Docs: https://immerjs.github.io/immer/
      // Required in `utils/storage-helper.ts`
      Immer.setAutoFreeze(false); // allow to merge mobx observables
      Immer.enableMapSet(); // allow to merge maps and sets
    },
  }),

  injectionToken: beforeApplicationIsReadyInjectionToken,
});

export default setupImmerInjectable;