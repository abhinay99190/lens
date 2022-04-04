/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onApplicationIsReadyInjectionToken } from "../on-application-is-ready-injection-token";
import { SentryInit } from "../../../../common/sentry";

const setupSentryInjectable = getInjectable({
  id: "setup-sentry",

  instantiate: () => ({
    run: () => {
      SentryInit();
    },
  }),

  causesSideEffects: true,

  injectionToken: onApplicationIsReadyInjectionToken,
});

export default setupSentryInjectable;
