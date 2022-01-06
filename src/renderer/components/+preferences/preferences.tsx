/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import "./preferences.scss";

import { IComputedValue, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { matchPath, Redirect, Route, RouteProps, Switch } from "react-router";
import {
  appRoute,
  appURL,
  editorURL,
  extensionRoute,
  extensionURL,
  kubernetesRoute,
  kubernetesURL,
  preferencesURL,
  proxyRoute,
  proxyURL,
  editorRoute,
  telemetryRoute,
  telemetryURL,
  extensionSettingsURL,
} from "../../../common/routes";
import { AppPreferenceRegistry } from "../../../extensions/registries/app-preference-registry";
import { navigateWithoutHistoryChange, navigation } from "../../navigation";
import { SettingLayout } from "../layout/setting-layout";
import { Tab, Tabs } from "../tabs";
import { Application } from "./application";
import { Kubernetes } from "./kubernetes";
import { Editor } from "./editor";
import { LensProxy } from "./proxy";
import { Telemetry } from "./telemetry";
import { Extensions } from "./extensions";
import { sentryDsn } from "../../../common/vars";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { InstalledExtension } from "../../../extensions/extension-discovery";
import userExtensionsInjectable from "../+extensions/user-extensions/user-extensions.injectable";
import { ExtensionSettingsPage } from "./extension-settings-page";

interface Dependencies {
  userExtensions: IComputedValue<InstalledExtension[]>;
}

@observer
class Preferences extends React.Component<Dependencies> {
  @observable historyLength: number | undefined;

  constructor(props: Dependencies) {
    super(props);
    makeObservable(this);
  }

  renderNavigation() {
    const preferenceRegistries = AppPreferenceRegistry.getInstance().getItems();
    const telemetryExtensions = preferenceRegistries.filter(e => e.showInPreferencesTab == "telemetry");
    const currentLocation = navigation.location.pathname;
    const isActive = (route: RouteProps) => !!matchPath(currentLocation, { path: route.path, exact: route.exact });
    const extensions = this.props.userExtensions.get().filter(extension =>
      preferenceRegistries.some(registry => registry.extensionId.includes(extension.manifest.name) && !registry.showInPreferencesTab),
    );

    return (
      <Tabs className="flex column" scrollable={false} onChange={(url) => {
        navigateWithoutHistoryChange({ pathname: url });
      }}>
        <div className="header">Preferences</div>
        <Tab value={appURL()} label="Application" data-testid="application-tab" active={isActive(appRoute)}/>
        <Tab value={proxyURL()} label="Proxy" data-testid="proxy-tab" active={isActive(proxyRoute)}/>
        <Tab value={kubernetesURL()} label="Kubernetes" data-testid="kubernetes-tab" active={isActive(kubernetesRoute)}/>
        <Tab value={editorURL()} label="Editor" data-testid="editor-tab" active={isActive(editorRoute)}/>
        {(telemetryExtensions.length > 0 || !!sentryDsn) &&
          <Tab value={telemetryURL()} label="Telemetry" data-testid="telemetry-tab" active={isActive(telemetryRoute)}/>
        }
        {preferenceRegistries.filter(e => !e.showInPreferencesTab).length > 0 &&
          <Tab value={extensionURL()} label="Extensions" data-testid="extensions-tab" active={isActive(extensionRoute)}/>
        }
        {extensions.length > 0 && (
          <div data-testid="custom-settings">
            <hr/>
            {extensions.map(extension => (
              <Tab key={extension.id} value={extensionSettingsURL({
                params: {
                  extensionId: encodeURIComponent(extension.manifest.name),
                },
              })} label={extension.manifest.name} active={currentLocation.includes(encodeURIComponent(extension.manifest.name))}/>
            ))}
          </div>
        )}
      </Tabs>
    );
  }

  render() {
    return (
      <SettingLayout
        navigation={this.renderNavigation()}
        className="Preferences"
        contentGaps={false}
      >
        <Switch>
          <Route path={appURL()} component={Application}/>
          <Route path={proxyURL()} component={LensProxy}/>
          <Route path={kubernetesURL()} component={Kubernetes}/>
          <Route path={editorURL()} component={Editor}/>
          <Route path={telemetryURL()} component={Telemetry}/>
          <Route path={extensionURL()} component={Extensions}/>
          <Route path={extensionSettingsURL()} component={ExtensionSettingsPage}/>
          <Redirect exact from={`${preferencesURL()}/`} to={appURL()}/>
        </Switch>
      </SettingLayout>
    );
  }
}

export default withInjectables<Dependencies>(
  Preferences,
  {
    getProps: (di) => ({
      userExtensions: di.inject(userExtensionsInjectable),
    }),
  },
);
