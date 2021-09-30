import {
  FeatureHandler,
  Feature,
  SettingItemsChanges
} from '../common/feature-manager/feature';

interface CompanyLastActionStorageItems {
  myCompanyLastAction: boolean;
}

@Feature({
  id: 'company-last-action',
  description: 'Company last action',
  storageReloadConnection: (settings): CompanyLastActionStorageItems => ({
    myCompanyLastAction: settings.pages.company.myCompanyLastAction
  })
})
export class CompanyLastActionFeature
  implements FeatureHandler<CompanyLastActionStorageItems>
{
  isFeatureActiveFromStorage(
    settingsItems: CompanyLastActionStorageItems
  ): boolean {
    return settingsItems.myCompanyLastAction;
  }

  featureBecameActive(settingsItems: CompanyLastActionStorageItems): void {
    console.log(settingsItems);
    // this.employeesRenderedSubscription = onCompanyEmployeesListRendered(() => );
  }

  storageConnectionChanged(
    _settingsItemsChanges: SettingItemsChanges<CompanyLastActionStorageItems>
  ): void {}

  featureBecameInactive(): void {
    console.log('Inactive now');
    // this.employeesRenderedSubscription.unsubscribe();
  }
}
