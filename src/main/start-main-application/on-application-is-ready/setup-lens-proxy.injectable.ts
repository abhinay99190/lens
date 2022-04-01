/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onApplicationIsReadyInjectionToken } from "../start-main-application.injectable";
import logger from "../../logger";
import {
  getAppVersion,
  getAppVersionFromProxyServer,
} from "../../../common/utils";
import { isWindows } from "../../../common/vars";
import exitAppInjectable from "../../app-paths/get-electron-app-path/electron-app/exit-app.injectable";
import { dialog } from "electron";
import lensProxyInjectable from "../../lens-proxy.injectable";

const setupLensProxyInjectable = getInjectable({
  id: "setup-lens-proxy",

  instantiate: (di) => {
    const lensProxy = di.inject(lensProxyInjectable);
    const exitApp = di.inject(exitAppInjectable);

    return {
      run: async () => {
        // test proxy connection
        try {
          logger.info("🔎 Testing LensProxy connection ...");
          const versionFromProxy = await getAppVersionFromProxyServer(
            lensProxy.port,
          );

          if (getAppVersion() !== versionFromProxy) {
            logger.error("Proxy server responded with invalid response");

            return exitApp();
          }

          logger.info("⚡ LensProxy connection OK");
        } catch (error) {
          logger.error(`🛑 LensProxy: failed connection test: ${error}`);

          const hostsPath = isWindows
            ? "C:\\windows\\system32\\drivers\\etc\\hosts"
            : "/etc/hosts";
          const message = [
            `Failed connection test: ${error}`,
            "Check to make sure that no other versions of Lens are running",
            `Check ${hostsPath} to make sure that it is clean and that the localhost loopback is at the top and set to 127.0.0.1`,
            "If you have HTTP_PROXY or http_proxy set in your environment, make sure that the localhost and the ipv4 loopback address 127.0.0.1 are added to the NO_PROXY environment variable.",
          ];

          dialog.showErrorBox("Lens Proxy Error", message.join("\n\n"));

          return exitApp();
        }
      },
    };
  },

  causesSideEffects: true,

  injectionToken: onApplicationIsReadyInjectionToken,
});

export default setupLensProxyInjectable;
