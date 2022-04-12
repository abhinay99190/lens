/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onApplicationHardQuitInjectionToken } from "../../on-application-hard-quit/on-application-hard-quit-injection-token";
import { isIntegrationTesting } from "../../../../common/vars";
import { runManyFor } from "../../run-many-for";
import { onApplicationSoftQuitInjectionToken } from "../on-application-soft-quit-injection-token";

const quitApplicationInjectable = getInjectable({
  id: "prevent-application-from-closing-involuntarily",

  instantiate: (di) => {
    const runMany = runManyFor(di);
    const runOnApplicationQuit = runMany(onApplicationHardQuitInjectionToken);

    return {
      run: async ({ event }) => {
        if (!isIntegrationTesting) {
          // &&!autoUpdateIsRunning) {
          event.preventDefault();

          return;
        }

        await runOnApplicationQuit({ event });
      },
    };
  },

  causesSideEffects: true,

  injectionToken: onApplicationSoftQuitInjectionToken,
});

export default quitApplicationInjectable;