import { Assets, AssetsBundle } from "pixi.js";
import { BundleLoadedCallback, ProgressCallback } from "./types";

/**
 * Class for asset loader
 */
export class AssetsLoader {
  public loadedBundles = new Map<string, any>();

  private allInitBundles = new Map<string, AssetsBundle>();

  /**
   * Initializes the loader
   * @param bundles - Initial bundles to load
   */
  public async init(bundles: AssetsBundle[]) {
    for (let i = 0; i < bundles.length; i += 1) {
      const bundle = bundles[i];

      if (bundle) {
        if (this.allInitBundles.get(bundle.name)) {
          throw new Error(`Asset loader has ${bundle.name} bundle`);
        } else {
          this.allInitBundles.set(bundle.name, bundle);
        }
      }
    }

    const manifest = { bundles };
    await Assets.init({ manifest });
  }

  /**
   * Asynchronous loading of bundles
   * @param bundleNames - Bundles for loading
   * @param onProgress - Callback for progress updates
   * @param bundleLoaded - Callback for loaded bundle end
   */
  public loadBundle(
    bundleNames: string | string[],
    onProgress?: ProgressCallback,
    bundleLoaded?: BundleLoadedCallback,
  ): Promise<void> {
    return new Promise((resolve) => {
      let bundleNamesToLoad = bundleNames;

      if (typeof bundleNamesToLoad === "string") {
        bundleNamesToLoad = [bundleNamesToLoad];
      }

      const { length } = bundleNamesToLoad;

      const promises = [];

      for (let i = 0; i < length; i++) {
        const bundleName = bundleNamesToLoad[i];

        if (bundleName) {
          if (!this.allInitBundles.get(bundleName)) {
            throw new Error(
              `The bundle ${bundleNamesToLoad[i]} is not initialized`,
            );
          }

          promises.push(
            this.loadAssetBundle(
              bundleName,
              i,
              length,
              onProgress,
              bundleLoaded,
            ),
          );
        }
      }

      Promise.all(promises).then(() => {
        onProgress?.(1);
        resolve();
      });
    });
  }

  private loadAssetBundle(
    bundleName: string,
    bundleNumber: number,
    bundlesCount: number,
    onProgress?: ProgressCallback,
    bundleLoaded?: BundleLoadedCallback,
  ): Promise<void> {
    const loadedBundle = Assets.loadBundle(bundleName, (progress) => {
      const currentProgress = (bundleNumber + progress) / bundlesCount;
      onProgress?.(currentProgress);
    });

    this.loadedBundles.set(bundleName, loadedBundle);
    bundleLoaded?.(bundleName);

    return loadedBundle;
  }

  /**
   * Asynchronous background loading of bundles
   * @param bundleNames - Bundles for background loading
   */
  public async lazyLoad(bundleNames: string | string[]): Promise<void> {
    let bundleNamesToLoad = bundleNames;

    if (typeof bundleNamesToLoad === "string") {
      bundleNamesToLoad = [bundleNamesToLoad];
    }

    const { length } = bundleNamesToLoad;

    for (let i = 0; i < length; i++) {
      const bundleName = bundleNamesToLoad[i];

      if (bundleName) {
        if (!this.allInitBundles.get(bundleName)) {
          throw new Error(
            `The bundle ${bundleNamesToLoad[i]} is not initialized`,
          );
        }
      }
    }

    await Assets.backgroundLoadBundle(bundleNamesToLoad);
  }

  /**
   * Gets any by ID from the loaded bundle
   * @param bundle - Bundle name
   * @param id - Asset identifier
   */
  public getAssetByBundleAndId(bundle: string, id: string) {
    return this.loadedBundles.get(bundle)[id];
  }

  /**
   * Resets the loader
   */
  public reset() {
    Assets.reset();
    this.loadedBundles = new Map();
  }

  /**
   * Unloads bundles
   * @param bundleNames - List of bundle IDs to unload
   */
  public async unloadBundle(bundleNames: string | string[]) {
    let bundleNamesToLoad = bundleNames;

    if (typeof bundleNamesToLoad === "string") {
      bundleNamesToLoad = [bundleNamesToLoad];
    }

    await Assets.unloadBundle(bundleNamesToLoad);
  }
}
