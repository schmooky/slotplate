import { ConfigKeys, ReelsConfigParams } from "../../types.js";

/**
 * Класс для управления конфигурацией рилов.
 * Рассчитывает размеры символов с учетом масштаба, а также минимальные и максимальные позиции по Y.
 * @template T Тип параметров конфигурации, наследуемый от ReelsConfigParams.
 */
export class ReelsConfig<T extends ReelsConfigParams = ReelsConfigParams> {
  /**
   * Параметры, связанные с символами рила.
   * @type {T[ConfigKeys.SYMBOLS_PARAMETERS]}
   * @public
   * @readonly
   */
  public readonly [ConfigKeys.SYMBOLS_PARAMETERS]!: T[ConfigKeys.SYMBOLS_PARAMETERS];

  /**
   * Параметры, связанные с рилами (масштаб, видимые индексы, дополнительные символы).
   * @type {T[ConfigKeys.REELS_PARAMETERS]}
   * @public
   * @readonly
   */
  public readonly [ConfigKeys.REELS_PARAMETERS]!: T[ConfigKeys.REELS_PARAMETERS];

  /**
   * Параметры, связанные с пулом объектов.
   * @type {T[ConfigKeys.OBJECT_POOL_PARAMETERS]}
   * @public
   * @readonly
   */
  public readonly [ConfigKeys.OBJECT_POOL_PARAMETERS]!: T[ConfigKeys.OBJECT_POOL_PARAMETERS];

  /**
   * Параметры контейнера, в котором расположены рилы.
   * @type {T[ConfigKeys.CONTAINER_PARAMETERS]}
   * @public
   * @readonly
   */
  public readonly [ConfigKeys.CONTAINER_PARAMETERS]!: T[ConfigKeys.CONTAINER_PARAMETERS];

  /**
   * Массив высот символов для каждого рила.
   * @type {number[]}
   * @private
   */
  private symbolHeights: number[] = [];

  /**
   * Массив ширин символов для каждого рила.
   * @type {number[]}
   * @private
   */
  private symbolWidths: number[] = [];

  /**
   * Массив максимальных позиций по Y для каждого рила.
   * @type {number[]}
   * @private
   */
  private maxPositionsY: number[] = [];

  /**
   * Массив минимальных позиций по Y для каждого рила.
   * @type {number[]}
   * @private
   */
  private minPositionsY: number[] = [];

  /**
   * Создает экземпляр конфигурации рилов.
   * @param {T} params Параметры конфигурации.
   */
  constructor(params: T) {
    this.initialize(params);
    this.calculateDimensions();
  }

  /**
   * Инициализирует конфигурацию, присваивая параметры текущему экземпляру.
   * @param {T} params Параметры конфигурации.
   * @private
   */
  private initialize(params: T): void {
    Object.assign(this, params);
  }

  /**
   * Рассчитывает масштабированные размеры символов и определяет минимальные/максимальные позиции для каждого рила.
   * @private
   */
  private calculateDimensions(): void {
    const { reelsScale, extraSymbols, reelsQuantity } = this.reelsParameters;
    const { symbolHeight, symbolWidth } = this.symbolsParameters;

    for (let reelIndex = 0; reelIndex < reelsQuantity; reelIndex++) {
      const scaledHeight = symbolHeight * reelsScale[reelIndex]!;
      const scaledWidth = symbolWidth * reelsScale[reelIndex]!;

      this.symbolHeights[reelIndex] = scaledHeight;
      this.symbolWidths[reelIndex] = scaledWidth;

      const symbolsAbove = extraSymbols[reelIndex]!.symbolsAbove;
      const symbolsVisible =
        this.reelsParameters.reelsVisibleIndices[reelIndex]!.length;
      const symbolsCount =
        symbolsAbove + symbolsVisible + extraSymbols[reelIndex]!.symbolsBelow;

      this.maxPositionsY[reelIndex] = scaledHeight * (symbolsCount - 1);
      this.minPositionsY[reelIndex] = -scaledHeight * symbolsAbove;
    }
  }

  /**
   * Возвращает высоту символа для указанного рила.
   * @param {number} reelIndex Индекс рила.
   * @returns {number} Высота символа.
   */
  public getSymbolHeight(reelIndex: number): number {
    return this.symbolHeights[reelIndex]!;
  }

  /**
   * Возвращает ширину символа для указанного рила.
   * @param {number} reelIndex Индекс рила.
   * @returns {number} Ширина символа.
   */
  public getSymbolWidth(reelIndex: number): number {
    return this.symbolWidths[reelIndex]!;
  }

  /**
   * Возвращает максимальную позицию по Y для указанного рила.
   * @param {number} reelIndex Индекс рила.
   * @returns {number} Максимальная позиция по Y.
   */
  public getMaxPositionY(reelIndex: number): number {
    return this.maxPositionsY[reelIndex]!;
  }

  /**
   * Возвращает минимальную позицию по Y для указанного рила.
   * @param {number} reelIndex Индекс рила.
   * @returns {number} Минимальная позиция по Y.
   */
  public getMinPositionY(reelIndex: number): number {
    return this.minPositionsY[reelIndex]!;
  }
}
