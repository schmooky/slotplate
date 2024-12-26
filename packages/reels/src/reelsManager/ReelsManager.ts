import { Reel } from "./../reel/index.js";
import { ExtraSymbolsConfig, Matrix, ReelsManagerParams } from "../../types.js";

/**
 * Управляет барабанами в слоте.
 */
export class ReelsManager {
  private static _instance: ReelsManager | null = null;

  /**
   * Protected конструктор для создания экземпляра ReelsManager.
   * @param {ReelsManagerParams} params - Объект параметров для инициализации.
   */
  protected constructor(public params: ReelsManagerParams) {}

  /**
   * Инициализирует экземпляр ReelsManager.
   * @param {ReelsManagerParams} params - Объект параметров для инициализации.
   * @returns {ReelsManager} Экземпляр ReelsManager.
   * @throws {Error} Если экземпляр уже был инициализирован.
   */
  public static initialize(params: ReelsManagerParams): ReelsManager {
    if (ReelsManager._instance) {
      throw new Error("ReelsManager has already been initialized.");
    }
    ReelsManager._instance = new ReelsManager(params);
    return this.instance;
  }

  /**
   * Возвращает текущий экземпляр ReelsManager.
   * @returns {ReelsManager} Экземпляр ReelsManager.
   * @throws {Error} Если экземпляр еще не был инициализирован.
   */
  public static get instance(): ReelsManager {
    if (!ReelsManager._instance) {
      throw new Error("ReelsManager is not initialized yet.");
    }
    return ReelsManager._instance;
  }

  /**
   * Устанавливает символы, которые должны быть исключены из вращения.
   * @param {string[]} excludeSymbols - Массив исключаемых символов.
   */
  public setExcludeRotateSymbols(excludeSymbols: string[]) {
    this.params.randomSymbolGenerator.setExcludeRotateSymbols(excludeSymbols);
  }

  /**
   * Устанавливает символы, которые должны быть исключены для extraSymbols (сверху и снизу, под маской).
   * @param {string[]} excludeSymbols - Массив исключаемых символов.
   */
  public setExcludeSymbols(excludeSymbols: string[]) {
    this.params.randomSymbolGenerator.setExcludeAboveBelowSymbols(
      excludeSymbols
    );
  }

  /**
   * Генерирует случайный символ.
   * @param {boolean} [useAboveBelow=false] - Указывает, использовать ли exclude символы для extraSymbols (сверху и снизу, под маской).
   * @returns {string} Случайный символ.
   */
  public getRandomSymbol = (useAboveBelow = false): string => {
    return this.params.randomSymbolGenerator.getNext(useAboveBelow);
  };

  /**
   * Устанавливает дополнительные символы для барабанов.
   * @param {ExtraSymbolsConfig} setExtraSymbols - Конфигурация дополнительных символов.
   */
  public setExtraSymbols(setExtraSymbols: ExtraSymbolsConfig) {
    this.params.framePreparer.setExtraSymbols(setExtraSymbols);
  }

  /**
   * Устанавливает состояния для барабанов по индексам.
   * @template ConfigType
   * @param {number[]} indexes - Массив индексов барабанов.
   * @param {string} stateType - Тип состояния.
   * @param {ConfigType} config - Конфигурация состояния.
   * @returns {Promise<void>} Промис, который завершается после применения состояний.
   */
  public async setStatesForReelsByIndexes<ConfigType>(
    indexes: number[],
    stateType: string,
    config: ConfigType
  ): Promise<void> {
    const reels = this.getReelsByIndexes(indexes);
    await this.params.stateManager.setStatesForReels<ConfigType>(
      reels,
      stateType,
      config
    );
  }

  /**
   * Останавливает состояния для барабанов.
   * @param {number[]} [indexes] - Опциональный массив индексов барабанов.
   */
  public stopStates(indexes?: number[]): void {
    const reels = indexes ? this.getReelsByIndexes(indexes) : this.params.reels;
    this.params.stateManager.stopReelsStates(reels);
  }

  /**
   * Устанавливает флаг пропуска состояний.
   * @param {boolean} skipActivated - Флаг, указывающий на необходимость пропуска.
   */
  public setSkipActivated(skipActivated: boolean) {
    this.params.stateManager.setSkipActivated(skipActivated);
    if (skipActivated) this.stopStates();
  }

  /**
   * Устанавливает анимацию для всех символов на барабанах.
   * @param {string} animationName - Название анимации.
   */
  public setAllReelsSymbolsAnimation(animationName: string): void {
    this.params.reels.forEach((reel) => {
      reel.symbols.forEach((symbol) => {
        symbol.playAnimation(animationName);
      });
    });
  }

  /**
   * Устанавливает кадры остановки для барабанов.
   * @param {Matrix<string>} frames - Матрица кадров для остановки.
   */
  public setStopFrame(frames: Matrix<string>): void {
    const preparedFrames = this.params.framePreparer.prepareFrames(frames, () =>
      this.getRandomSymbol(true)
    );
    this.params.reels.forEach((reel, reelIndex) => {
      reel.setStopFrame(preparedFrames[reelIndex]!);
    });
  }

  /**
   * Возвращает флаг пропуска состояний.
   * @returns {boolean} Флаг пропуска состояний.
   */
  public get skipActivated() {
    return this.params.stateManager.skipActivated;
  }

  /**
   * Получает барабаны по индексам.
   * @private
   * @param {number[]} indexes - Массив индексов барабанов.
   * @returns {Reel[]} Массив барабанов.
   * @throws {Error} Если барабан с указанным индексом не найден.
   */
  private getReelsByIndexes(indexes: number[]): Reel[] {
    return indexes.map((index) => {
      const reel = this.params.reels[index];
      if (!reel) {
        throw new Error(`reel ${index} does not exist.`);
      }
      return reel;
    });
  }
}
