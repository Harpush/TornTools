export enum StorageKey {
  Settings = 'settings'
}

const storageKeys = Object.values(StorageKey);

const isStorageKey = (key: string): key is StorageKey =>
  storageKeys.some(storageKey => storageKey === key);

export interface StorageModel {
  [StorageKey.Settings]: {
    pages: {
      company: {
        myCompanyLastAction: boolean;
      };
    };
  };
}

const defaultStorage: StorageModel = {
  [StorageKey.Settings]: {
    pages: {
      company: {
        myCompanyLastAction: true
      }
    }
  }
};

let currentStorage: StorageModel;

const loadStorage = async () => {
  if (currentStorage !== undefined) {
    return currentStorage;
  }

  const chromeStorage = await new Promise<StorageModel>(resolve =>
    chrome.storage.local.get(null, items => resolve(items as StorageModel))
  );

  if (!chromeStorage || !Object.keys(chromeStorage).length) {
    // TODO: Any reason to set default?
    await chrome.storage.local.set(defaultStorage);
    return (currentStorage = defaultStorage);
  }

  return (currentStorage = chromeStorage);
};

export const getStorageEntry = async <T extends StorageKey>(
  storageKey: T
): Promise<StorageModel[T]> => {
  const storage = await loadStorage();
  return storage[storageKey];
};

type StorageListenerCallback<T extends StorageKey = StorageKey> = (
  oldStorageEntry: StorageModel[T],
  newStorageEntry: StorageModel[T]
) => void;

const storageListeners: {
  [P in StorageKey]?: StorageListenerCallback<P>[];
} = {};

export const onStorageChanged = <T extends StorageKey>(
  storageKey: T,
  callback: StorageListenerCallback<T>
): void => {
  const storageEntryListeners = storageListeners[storageKey];

  if (!storageEntryListeners) {
    storageListeners[storageKey] = [callback as StorageListenerCallback];
  } else {
    storageEntryListeners.push(callback as StorageListenerCallback);
  }
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') {
    return;
  }

  for (const key in changes) {
    if (!isStorageKey(key)) {
      // We only want to handle known storage keys
      continue;
    }

    currentStorage[key] = changes[key].newValue;

    const storageEntryListeners = storageListeners[key];

    if (storageEntryListeners) {
      storageEntryListeners.forEach(listener =>
        listener(changes[key].oldValue, changes[key].newValue)
      );
    }
  }
});
