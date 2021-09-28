import { StorageModel } from '../storage';
import { Type } from '../utils';

/**
 * Every feature must implement this allowing for lifecycle management.
 */
export interface FeatureHandler<T> {
  /**
   * Before calling firstLoad or storageConnectionChanged we need to make sure
   * the feature should be active. This function validates it
   */
  isFeatureActiveFromStorage(settingsItems: T): boolean;
  /**
   * Called only once at feature startup
   * TODO: Needed or only storageConnectionChanged?
   */
  firstLoad(settingsItems: T): void;
  /**
   * Called on every changed in settingsItems which didn't
   * result in feature deactivate
   */
  // TODO: Pass changes object instead ({changedKey: {oldValue, newValue}})
  storageConnectionChanged(settingsItems: T): void;
  /**
   * Cleanup logic when the feature became inactive
   */
  featureBecameInactive(): void;
}

/**
 * Configuration for the feature
 */
export interface FeatureConfig<T> {
  /**
   * A unique id across all features per page
   */
  id: string;
  /**
   * The description of the feature - will be displayed in the features popup
   */
  description: string;
  /**
   * An subset object from the storage
   * Will be used to check for changes using values reference check
   * Should be a simple json object - {...}
   */
  storageReloadConnection: (storage: StorageModel) => T;
}

/**
 * A decorator that adds info on a feature
 */
export function Feature<T>(featureConfig: FeatureConfig<T>) {
  return function (target: Type<FeatureHandler<T>>) {
    // TODO: reflect-metadata?
    const featureConfigSymbol = Symbol.for('tt:feature-config');
    (target as any)[featureConfigSymbol] = featureConfig;
  };
}
