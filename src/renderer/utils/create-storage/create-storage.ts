/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// Keeps window.localStorage state in external JSON-files.
// Because app creates random port between restarts => storage session wiped out each time.
import { comparer, reaction, toJS, when } from "mobx";
import { StorageHelper } from "../storageHelper";
import { isTestEnv } from "../../../common/vars";

import { getHostedClusterId } from "../../../common/utils";
import type { JsonObject, JsonValue } from "type-fest";
import type { Logger } from "../../../common/logger";
import type { GetAbsolutePath } from "../../../common/path/get-absolute-path.injectable";

interface Dependencies {
  storage: { initialized: boolean; loaded: boolean; data: Record<string, any> };
  logger: Logger;
  directoryForLensLocalStorage: string;
  readJsonFile: (filePath: string) => Promise<JsonValue>;
  writeJsonFile: (filePath: string, contentObject: JsonObject) => Promise<void>;
  getAbsolutePath: GetAbsolutePath;
}

/**
 * Creates a helper for saving data under the "key" intended for window.localStorage
 */
export const createStorage = ({ storage, getAbsolutePath, logger, directoryForLensLocalStorage, readJsonFile, writeJsonFile }: Dependencies) => <T>(key: string, defaultValue: T) => {
  const { logPrefix } = StorageHelper;

  if (!storage.initialized) {
    storage.initialized = true;

    (async () => {
      const filePath = getAbsolutePath(directoryForLensLocalStorage, `${getHostedClusterId() || "app"}.json`);

      try {
        storage.data = (await readJsonFile(filePath)) as JsonObject;
      }

      // eslint-disable-next-line no-empty
      catch {}

      finally {
        if (!isTestEnv) {
          logger.info(`${logPrefix} loading finished for ${filePath}`);
        }

        storage.loaded = true;
      }

      // bind auto-saving data changes to %storage-file.json
      reaction(() => toJS(storage.data), saveFile, {
        delay: 250, // lazy, avoid excessive writes to fs
        equals: comparer.structural, // save only when something really changed
      });

      async function saveFile(state: Record<string, any> = {}) {
        logger.info(`${logPrefix} saving ${filePath}`);

        try {
          await writeJsonFile(filePath, state);
        } catch (error) {
          logger.error(`${logPrefix} saving failed: ${error}`, {
            json: state, jsonFilePath: filePath,
          });
        }
      }
    })()
      .catch(error => logger.error(`${logPrefix} Failed to initialize storage: ${error}`));
  }

  return new StorageHelper<T>(key, {
    autoInit: true,
    defaultValue,
    storage: {
      async getItem(key: string) {
        await when(() => storage.loaded);

        return storage.data[key];
      },
      setItem(key: string, value: any) {
        storage.data[key] = value;
      },
      removeItem(key: string) {
        delete storage.data[key];
      },
    },
  });
};
