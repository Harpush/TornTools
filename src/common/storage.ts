export interface StorageModel {
  settings: {
    pages: {
      company: {
        myCompanyLastAction: boolean;
      };
    };
  };
}

const defaultStorage: StorageModel = {
  settings: {
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
    await chrome.storage.local.set(defaultStorage);
    return (currentStorage = defaultStorage);
  }

  return (currentStorage = chromeStorage);
};

export const getAllStorage = async () => await loadStorage();

chrome.storage.onChanged.addListener((_changes, area) => {
  if (area !== 'local') {
    return;
  }

  // for (const key in changes) {
  //   switch (key) {
  //     case 'settings':
  //       settings = changes.settings.newValue;
  //       break;
  //     case 'filters':
  //       filters = changes.filters.newValue;
  //       break;
  //     case 'version':
  //       version = changes.version.newValue;
  //       break;
  //     case 'userdata':
  //       userdata = changes.userdata.newValue;
  //       break;
  //     case 'api':
  //       api = changes.api.newValue;
  //       break;
  //     case 'torndata':
  //       torndata = changes.torndata.newValue;
  //       break;
  //     case 'stakeouts':
  //       stakeouts = changes.stakeouts.newValue;
  //       break;
  //     case 'attackHistory':
  //       attackHistory = changes.attackHistory.newValue;
  //       break;
  //     case 'notes':
  //       notes = changes.notes.newValue;
  //       break;
  //     case 'factiondata':
  //       factiondata = changes.factiondata.newValue;
  //       break;
  //     case 'quick':
  //       quick = changes.quick.newValue;
  //       break;
  //     case 'localdata':
  //       localdata = changes.localdata.newValue;
  //       break;
  //     case 'cache':
  //       ttCache.cache = changes.cache.newValue;
  //       break;
  //     case 'usage':
  //       ttCache.usage = changes.usage.newValue;
  //       break;
  //     case 'npcs':
  //       npcs = changes.npcs.newValue;
  //       break;
  //   }
  //   if (storageListeners[key])
  //     storageListeners[key].forEach(listener =>
  //       listener(changes[key].oldValue)
  //     );
  // }
});
