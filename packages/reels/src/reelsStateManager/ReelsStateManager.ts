import { AbstractStateFactory } from "../abstractStateFactory/index.js";

import { Reel } from "./../reel/index.js";

/**
 * Управляет состояниями барабанов в игровом автомате.
 */
export class ReelsStateManager {
  /**
   * Указывает, следует ли пропускать переключение состояний барабанов.
   */
  public skipActivated: boolean = false;

  /**
   * Создает экземпляр ReelsStateManager.
   * @param {AbstractStateFactory} stateFactory - Фабрика для создания состояний барабанов.
   */
  constructor(private stateFactory: AbstractStateFactory) {}

  /**
   * Устанавливает состояния для заданных барабанов.
   * @template ConfigType
   * @param {Reel[]} reels - Массив барабанов, для которых нужно установить состояние.
   * @param {string} stateType - Тип состояния, которое нужно применить.
   * @param {ConfigType} config - Конфигурация для состояния.
   * @returns {Promise<void>} Промис, который завершается после применения всех состояний.
   */
  public async setStatesForReels<ConfigType>(
    reels: Reel[],
    stateType: string,
    config: ConfigType
  ): Promise<void> {
    const promises = reels.map((reel) => {
      const state = this.stateFactory.getState(reel, stateType);
      if (this.skipActivated && state.canSkip()) {
        return Promise.resolve();
      }
      return reel.setReelState<ConfigType>(state, config);
    });

    await Promise.all(promises);
  }

  /**
   * Останавливает состояния для заданных барабанов.
   * @param {Reel[]} reels - Массив барабанов, для которых нужно остановить состояние.
   */
  public stopReelsStates(reels: Reel[]): void {
    reels.forEach((reel) => reel.stopState());
  }

  /**
   * Устанавливает флаг пропуска состояний.
   * @param {boolean} skip - Флаг, указывающий, следует ли пропускать состояния.
   */
  public setSkipActivated(skip: boolean): void {
    this.skipActivated = skip;
  }
}
