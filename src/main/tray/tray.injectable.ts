/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import packageInfo from "../../../package.json";
import { Menu, Tray } from "electron";
import { reaction } from "mobx";
import logger from "../logger";
import { isDevelopment, isWindows, staticFilesDirectory } from "../../common/vars";
import type { Disposer } from "../../common/utils";
import { disposer } from "../../common/utils";
import { getInjectable } from "@ogre-tools/injectable";
import windowManagerInjectable from "../window-manager.injectable";
import trayMenuInjectable from "./tray-menu.injectable";

export const TRAY_LOG_PREFIX = "[TRAY]";

export function getTrayIcon(): string {
  return path.resolve(
    staticFilesDirectory,
    isDevelopment ? "../build/tray" : "icons", // copied within electron-builder extras
    "trayIconTemplate.png",
  );
}

const initTrayInjectable = getInjectable({
  id: "init-tray",
  instantiate: (di): Disposer => {
    const windowManager = di.inject(windowManagerInjectable);
    const trayMenu = di.inject(trayMenuInjectable);

    const icon = getTrayIcon();
    const tray = new Tray(icon);

    tray.setToolTip(packageInfo.description);
    tray.setIgnoreDoubleClickEvents(true);

    if (isWindows) {
      tray.on("click", () => {
        windowManager
          .ensureMainWindow()
          .catch(error => logger.error(`${TRAY_LOG_PREFIX}: Failed to open lens`, { error }));
      });
    }

    return disposer(
      () => tray.destroy(),
      reaction(
        () => trayMenu.get(),
        menuItemOptions => tray.setContextMenu(Menu.buildFromTemplate(menuItemOptions)),
        {
          fireImmediately: true,
        },
      ),
    );
  },
});

export default initTrayInjectable;
