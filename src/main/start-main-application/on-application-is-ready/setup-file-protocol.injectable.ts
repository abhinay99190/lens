/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { onApplicationIsReadyInjectionToken } from "../start-main-application.injectable";
import { registerFileProtocol } from "../../../common/register-protocol";

// TODO: Remove side effect on import defining __static
import "../../../common/vars";

const setupFileProtocolInjectable = getInjectable({

  id: "setup-file-protocol",

  instantiate: () => ({
    run: () => {
      registerFileProtocol("static", __static);
    },
  }),

  causesSideEffects: true,

  injectionToken: onApplicationIsReadyInjectionToken,
});

export default setupFileProtocolInjectable;
