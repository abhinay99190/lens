/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import electronAppInjectable from "../../app-paths/get-electron-app-path/electron-app/electron-app.injectable";
import appNameInjectable from "../../app-paths/app-name/app-name.injectable";
import { beforeApplicationIsReadyInjectionToken } from "../start-main-application.injectable";

const setupApplicationNameInjectable = getInjectable({
  id: "setup-application-name",

  instantiate: (di) => ({
    run: () => {
      const app = di.inject(electronAppInjectable);
      const appName = di.inject(appNameInjectable);

      app.setName(appName);
    },
  }),

  injectionToken: beforeApplicationIsReadyInjectionToken,
});

export default setupApplicationNameInjectable;
