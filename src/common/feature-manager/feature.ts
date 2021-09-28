import { StorageKey, StorageModel } from '../storage';
import { Type } from '../utils';

export type SettingsItemsChange<T> = { previousValue: T; currentValue: T };

export type SettingItemsChanges<T extends Record<string, any>> = {
  [P in keyof T]?: SettingsItemsChange<T>;
};

/**
 * Every feature must implement this allowing for lifecycle management.
 */
export interface FeatureHandler<T extends Record<string, any>> {
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
  storageConnectionChanged(settingsItemsChanges: SettingItemsChanges<T>): void;
  /**
   * Cleanup logic when the feature became inactive
   */
  featureBecameInactive(): void;
}

/**
 * Configuration for the feature
 */
export interface FeatureConfig<T extends Record<string, any>> {
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
  storageReloadConnection: (storage: StorageModel[StorageKey.Settings]) => T;
}

/**
 * A decorator that adds info on a feature
 */
export function Feature<T extends Record<string, any>>(
  featureConfig: FeatureConfig<T>
) {
  return function (target: Type<FeatureHandler<T>>) {
    // TODO: reflect-metadata?
    const featureConfigSymbol = Symbol.for('tt:feature-config');
    (target as any)[featureConfigSymbol] = featureConfig;
  };
}
