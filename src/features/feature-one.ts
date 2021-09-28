import {
  FeatureHandler,
  Feature,
  SettingItemsChanges
} from '../common/feature-manager/feature';

interface FeatureOneStorageItems {
  myCompanyLastAction: boolean;
}

@Feature({
  id: 'feature-one',
  description: 'Feature one',
  storageReloadConnection: (settings): FeatureOneStorageItems => ({
    myCompanyLastAction: settings.pages.company.myCompanyLastAction
  })
})
export class FeatureOne implements FeatureHandler<FeatureOneStorageItems> {
  isFeatureActiveFromStorage(settingsItems: FeatureOneStorageItems): boolean {
    return settingsItems.myCompanyLastAction;
  }

  firstLoad(settingsItems: FeatureOneStorageItems): void {
    console.log(settingsItems);
  }

  storageConnectionChanged(
    settingsItemsChanges: SettingItemsChanges<FeatureOneStorageItems>
  ): void {
    // if (settingsItemsChanges.myCompanyLastAction) {
    //   const myCompanyLastAction = settingsItemsChanges.myCompanyLastAction.currentValue;
    //   // Handle change
    // }

    console.log(settingsItemsChanges);
  }

  featureBecameInactive(): void {
    console.log('Inactive now');
  }
}
