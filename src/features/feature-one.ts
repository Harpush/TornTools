import { FeatureHandler, Feature } from '../common/feature-manager/feature';

interface FeatureOneStorageItems {
  myCompanyLastAction: boolean;
}

@Feature({
  id: 'feature-one',
  description: 'Feature one',
  storageReloadConnection: (storage): FeatureOneStorageItems => ({
    myCompanyLastAction: storage.settings.pages.company.myCompanyLastAction
  })
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
