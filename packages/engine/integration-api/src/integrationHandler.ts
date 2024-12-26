import { EveryMatrixListener } from "./everyMatrixListener.js";
import { IntegrationMethods } from "./types/integrationMethods.js";

export class IntegrationHandler {
  public listeners: Record<IntegrationMethods, () => void> = {} as Record<
    IntegrationMethods,
    () => void
  >;

  constructor(methods: { method: IntegrationMethods; callback: () => void }[]) {
    const uniqueMethods = Array.from(
      new Set(methods.map(({ method }) => method))
    );

    uniqueMethods.forEach((method) => {
      const callback = methods.find((m) => m.method === method)?.callback;
      if (callback) {
        this.listeners[method] = callback;
      }
    });

    this.verifyAllCallbacks();
    new EveryMatrixListener(this);
  }

  private verifyAllCallbacks() {
    const missingCallbacks = Object.values(IntegrationMethods).filter(
      (method) => !this.listeners[method]
    );

    if (missingCallbacks.length > 0) {
      throw new Error(
        `Missing callbacks for the following IntegrationMethods: ${missingCallbacks.join(", ")}`
      );
    }
  }

  public dispatch(type: IntegrationMethods) {
    const callback = this.listeners[type];

    if (callback) {
      callback();
    }
  }
}
