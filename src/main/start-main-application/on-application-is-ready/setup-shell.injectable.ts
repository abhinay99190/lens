/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onApplicationIsReadyInjectionToken } from "../start-main-application.injectable";
import { shellSync } from "../../shell-sync";
import loggerInjectable from "../../../common/logger.injectable";

const setupShellInjectable = getInjectable({
  id: "setup-shell",

  instantiate: (di) => {
    const logger = di.inject(loggerInjectable);

    return {
      run: async () => {
        logger.info("🐚 Syncing shell environment");

        await shellSync();
      },
    };
  },

  injectionToken: onApplicationIsReadyInjectionToken,
  causesSideEffects: true,
});

export default setupShellInjectable;
