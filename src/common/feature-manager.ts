import { FeatureConfig, FeatureHandler } from './feature-manager/feature';
import { FeaturesStatusPopup } from './features-info-popup';
import { getAllStorage, StorageModel } from './storage';
import { log, Type } from './utils';

interface FeatureInfo {
  id: string;
  description: string;
  storageReloadConnection: (storage: StorageModel) => unknown;
  featureInstance: FeatureHandler<unknown>;
  isInitialized: boolean;
}

export const bootstrapFeatures = async (
  features: Type<FeatureHandler<any>>[]
) => {
  const featuresInfo = new Map<string, FeatureInfo>();
  const featuresPopup = new FeaturesStatusPopup();

  const port = chrome.runtime.connect({ name: 'status-check' });
  port.onDisconnect.addListener(() => {
    for (const featureInfo of featuresInfo.values()) {
      if (!featureInfo.isInitialized) {
        continue;
      }

      featureInfo.featureInstance.featureBecameInactive();
      featuresPopup.updateFeatureStatus(featureInfo.id, 'inactive');

      log(
        '[TornTools] FeatureManager - Feature disabled on extension disconnect',
        featureInfo.id,
        featureInfo.description
      );
    }
  });

  // TODO: reflect-metadata?
  const featureConfigSymbol = Symbol.for('tt:feature-config');

  for (const feature of features) {
    // TODO: reflect-metadata?
    const featureConfig = (feature as any)[
      featureConfigSymbol
    ] as FeatureConfig<any>;

    if (featuresInfo.has(featureConfig.id)) {
      throw new Error(
        `[Error][TornTools] Feature with id ${featureConfig.id} is already registered!`
      );
    }

    const featureInstance = new feature();

    featuresInfo.set(featureConfig.id, {
      id: featureConfig.id,
      description: featureConfig.description,
      storageReloadConnection: featureConfig.storageReloadConnection,
      featureInstance,
      isInitialized: false
    });

    featuresPopup.addFeature(featureConfig.id, featureConfig.description);

    log(
      '[TornTools] FeatureManager - Registered new feature',
      featureConfig.id,
      featureConfig.description
    );

    // TODO: try catch
    const storageModel = await getAllStorage();

    const featureStorageOptions =
      featureConfig.storageReloadConnection(storageModel);

    const isActive = featureInstance.isFeatureActiveFromStorage(
      featureStorageOptions
    );

    if (isActive) {
      featureInstance.firstLoad(featureStorageOptions);
      featuresInfo.get(featureConfig.id)!.isInitialized = true;
      featuresPopup.updateFeatureStatus(featureConfig.id, 'active');

      log(
        '[TornTools] FeatureManager - Feature started',
        featureConfig.id,
        featureConfig.description
      );
    }

    // onStorageChanged(newStorage => {
    //   for (const featureInfo of featuresInfo.values()) {
    //     const featureStorageOptions = featureInfo.storageReloadConnection(newStorage);
    //     // Dirty check
    //     const isActive = featureInstance.isFeatureActiveFromStorage(
    //       featureStorageOptions
    //     );

    //     if (isActive) {
    //       featureInfo.featureInstance.storageConnectionChanged(featureStorageOptions);
    //       featuresInfo.get(featureConfig.id)!.isInitialized = true;
    //       featuresPopup.updateFeatureStatus(featureConfig.id, 'active');

    //       log(
    //         '[TornTools] FeatureManager - Feature updated from storage',
    //         featureConfig.id,
    //         featureConfig.description
    //       );
    //     } else if (featureInfo.isInitialized) {
    //       featureInfo.featureInstance.featureBecameInactive();
    //       featuresInfo.get(featureConfig.id)!.isInitialized = false;
    //       featuresPopup.updateFeatureStatus(featureConfig.id, 'inactive');

    //       log(
    //         '[TornTools] FeatureManager - Feature disabled from storage',
    //         featureConfig.id,
    //         featureConfig.description
    //       );
    //     }
    //   }
    // });
  }

  document.body.appendChild(featuresPopup.element);
};
