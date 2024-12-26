import { AnalyticsManager as PackageAnalyticsManager } from '@gambit/analytics';
import { rootStore } from '@src/stores/RootStore';
import { network } from '@lib/nework/nework';

export class AnalyticsManager extends PackageAnalyticsManager {
  // eslint-disable-next-line no-use-before-define
  private static _: AnalyticsManager;

  static get instance(): AnalyticsManager {
    if (!AnalyticsManager._) {
      AnalyticsManager._ = new AnalyticsManager();
    }
    return AnalyticsManager._;
  }

  private constructor() {
    super(rootStore.dataStore.currency, network.logger);
  }
}
