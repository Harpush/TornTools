import {
  FeatureConfig,
  FeatureHandler,
  SettingItemsChanges,
  SettingsItemsChange
} from './feature';
import { FeaturesStatusPopup } from './features-info-popup/features-info-popup';
import {
  getStorageEntry,
  onStorageChanged,
  StorageKey,
  StorageModel
} from '../storage';
import { log, Type } from '../utils';

interface FeatureInfo {
  id: string;
  description: string;
  storageReloadConnection: (
    storage: StorageModel[StorageKey.Settings]
  ) => Record<string, any>;
  featureInstance: FeatureHandler<Record<string, any>>;
  isActive: boolean;
}

/**
 * Given a list of feature classes initialize them and handle their lifecycle
 */
export const bootstrapFeatures = async (
  features: Type<FeatureHandler<any>>[]
) => {
  const featuresInfoMap = new Map<string, FeatureInfo>();
  const featuresPopup = new FeaturesStatusPopup();

  // TODO: reflect-metadata?
  const featureConfigSymbol = Symbol.for('tt:feature-config');

  for (const feature of features) {
    // TODO: reflect-metadata?
    const featureConfig = (feature as any)[
      featureConfigSymbol
    ] as FeatureConfig<Record<string, any>>;

    if (featuresInfoMap.has(featureConfig.id)) {
      throw new Error(
        `[Error][TornTools] Feature with id ${featureConfig.id} is already registered!`
      );
    }

    const featureInstance = new feature();

    featuresInfoMap.set(featureConfig.id, {
      id: featureConfig.id,
      description: featureConfig.description,
      storageReloadConnection: featureConfig.storageReloadConnection,
      featureInstance,
      isActive: false
    });

    featuresPopup.addFeature(featureConfig.id, featureConfig.description);

    log(
      '[TornTools] FeatureManager - Registered new feature',
      featureConfig.id,
      featureConfig.description
    );

    // TODO: try catch
    const settingsModel = await getStorageEntry(StorageKey.Settings);

    const featureStorageOptions =
      featureConfig.storageReloadConnection(settingsModel);

    const isActive = featureInstance.isFeatureActiveFromStorage(
      featureStorageOptions
    );

    if (isActive) {
      featureInstance.featureBecameActive(featureStorageOptions);
      featuresInfoMap.get(featureConfig.id)!.isActive = true;
      featuresPopup.updateFeatureStatus(featureConfig.id, 'active');

      log(
        '[TornTools] FeatureManager - Feature started',
        featureConfig.id,
        featureConfig.description
      );
    }
  }

  onStorageChanged(StorageKey.Settings, (oldSettings, newSettings) => {
    const featuresInfo = Array.from(featuresInfoMap.values());

    for (const featureInfo of featuresInfo) {
      const oldFeatureStorageOptions =
        featureInfo.storageReloadConnection(oldSettings);
      const newFeatureStorageOptions =
        featureInfo.storageReloadConnection(newSettings);

      const changes: SettingItemsChanges<Record<string, any>> = {};

      for (const key in newFeatureStorageOptions) {
        if (newFeatureStorageOptions[key] !== oldFeatureStorageOptions[key]) {
          const change: SettingsItemsChange<any> = {
            previousValue: oldFeatureStorageOptions[key],
            currentValue: newFeatureStorageOptions[key]
          };

          changes[key] = change;
        }
      }

      if (!Object.keys(changes).length) {
        // If no change - there is nothing to do in this feature
        continue;
      }

      const isBecomingActive =
        featureInfo.featureInstance.isFeatureActiveFromStorage(
          newFeatureStorageOptions
        );

      if (isBecomingActive && !featureInfo.isActive) {
        featureInfo.featureInstance.featureBecameActive(
          newFeatureStorageOptions
        );
        featureInfo.isActive = true;
        featuresPopup.updateFeatureStatus(featureInfo.id, 'active');

        log(
          '[TornTools] FeatureManager - Feature reinitialized from storage',
          featureInfo.id,
          featureInfo.description
        );
      } else if (isBecomingActive && featureInfo.isActive) {
        featureInfo.featureInstance.storageConnectionChanged(changes);
        featureInfo.isActive = true;
        featuresPopup.updateFeatureStatus(featureInfo.id, 'active');

        log(
          '[TornTools] FeatureManager - Feature updated from storage',
          featureInfo.id,
          featureInfo.description
        );
      } else if (!isBecomingActive && featureInfo.isActive) {
        featureInfo.featureInstance.featureBecameInactive();
        featureInfo.isActive = false;
        featuresPopup.updateFeatureStatus(featureInfo.id, 'inactive');

        log(
          '[TornTools] FeatureManager - Feature disabled from storage',
          featureInfo.id,
          featureInfo.description
        );
      }
    }
  });

  const port = chrome.runtime.connect({ name: 'status-check' });
  port.onDisconnect.addListener(() => {
    const featuresInfo = Array.from(featuresInfoMap.values());

    for (const featureInfo of featuresInfo) {
      if (!featureInfo.isActive) {
        continue;
      }

      featureInfo.featureInstance.featureBecameInactive();
      featureInfo.isActive = false;
      featuresPopup.updateFeatureStatus(featureInfo.id, 'inactive');

      log(
        '[TornTools] FeatureManager - Feature disabled on extension disconnect',
        featureInfo.id,
        featureInfo.description
      );
    }
  });

  document.body.appendChild(featuresPopup.element);
};
