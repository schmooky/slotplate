import { IntegrationHandler } from "./integrationHandler.js";
import {
  EveryMatrixMethods,
  platformEveryMatrixMap,
} from "./types/everyMatrixMethods.js";

export class EveryMatrixListener {
  constructor(protected integrationHandler: IntegrationHandler) {
    window.addEventListener("message", this.handleMessage);
  }

  private handleMessage = (event: MessageEvent): void => {
    const { type } = event.data;

    const standardizedType = platformEveryMatrixMap[type as EveryMatrixMethods];

    if (standardizedType) {
      this.integrationHandler.dispatch(standardizedType);
    }
  };
}
