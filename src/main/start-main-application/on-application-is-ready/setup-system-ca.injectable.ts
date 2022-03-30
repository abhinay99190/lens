/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { injectSystemCAs } from "../../../common/system-ca";

import { getInjectable } from "@ogre-tools/injectable";
import {
  onApplicationIsReadyInjectionToken,
} from "../start-main-application.injectable";

const setupSystemCaInjectable = getInjectable({
  id: "setup-system-ca",

  instantiate: () => ({
    run: async () => {
      await injectSystemCAs();
    },
  }),

  injectionToken: onApplicationIsReadyInjectionToken,
});

export default setupSystemCaInjectable;
