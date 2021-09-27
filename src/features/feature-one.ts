import { FeatureHandler, Feature } from '../common/feature-manager/feature';
import { StorageModel } from '../common/storage';

interface FeatureOneStorageItems {
  myCompanyLastAction: boolean;
}

function storageReloadConnection(
  storage: StorageModel
): FeatureOneStorageItems {
  return {
    myCompanyLastAction: storage.settings.pages.company.myCompanyLastAction
  };
}

@Feature({
  id: '',
  description: '',
  storageReloadConnection
})
export class FeatureOne implements FeatureHandler<FeatureOneStorageItems> {
  isFeatureActiveFromStorage(settingsItems: FeatureOneStorageItems): boolean {
    return settingsItems.myCompanyLastAction;
  }

  firstLoad(settingsItems: FeatureOneStorageItems): void {
    console.log(settingsItems);
  }

  storageConnectionChanged(settingsItems: FeatureOneStorageItems): void {
    console.log(settingsItems);
  }

  featureBecameInactive(): void {
    console.log('Inactive now');
  }
}
