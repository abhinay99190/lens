/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../../routes/has-access-to-route.injectable";
import clusterRolesRouteInjectable from "./cluster-roles-route.injectable";
import {
  userManagementChildSidebarItemsInjectionToken,
} from "../user-management-sidebar-items.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";

const clusterRolesSidebarItemsInjectable = getInjectable({
  id: "cluster-roles-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterRolesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Cluster Roles",
        onClick: () => navigateToRoute(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: userManagementChildSidebarItemsInjectionToken,
});

export default clusterRolesSidebarItemsInjectable;
