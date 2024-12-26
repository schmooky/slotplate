import { IntegrationMethods } from "./integrationMethods.js";

export enum EveryMatrixMethods {
  // TODO: These methods will be added.
  // AutoplayStarted = "startAutoplay",

  AutoplayStopped = "stopAutoplay",
}

export const platformEveryMatrixMap: Record<
  EveryMatrixMethods,
  IntegrationMethods
> = {
  [EveryMatrixMethods.AutoplayStopped]: IntegrationMethods.AutoplayStop,
};
