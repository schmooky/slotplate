import { ExtraSymbolsConfig, Matrix } from "../../types.js";

/**
 * Класс для подготовки фреймов рилов с учетом дополнительных символов сверху и снизу.
 */
export class FramePreparer {
  /**
   * Создает экземпляр FramePreparer.
   * @param {ExtraSymbolsConfig} extraSymbols - Конфигурация дополнительных символов для каждого рила.
   */
  constructor(private extraSymbols: ExtraSymbolsConfig) {}

  /**
   * Подготавливает фреймы, добавляя дополнительные символы сверху и снизу для каждого рила.
   * @param {Matrix<string>} frames - Исходная матрица фреймов, где каждая строка - это массив символов для рила.
   * @param {() => string} getRandomSymbol - Функция для получения случайного символа.
   * @returns {Matrix<string>} Обновленная матрица фреймов с добавленными символами.
   */
  public prepareFrames(
    frames: Matrix<string>,
    getRandomSymbol: () => string
  ): Matrix<string> {
    this.lengthCheck(frames.length);

    return frames.map((reelFrame, reelIndex) => {
      const symbolsAbove = Array.from(
        { length: this.extraSymbols[reelIndex]!.symbolsAbove },
        () => getRandomSymbol()
      );

      const symbolsBelow = Array.from(
        { length: this.extraSymbols[reelIndex]!.symbolsBelow },
        () => getRandomSymbol()
      );

      return [...symbolsAbove, ...reelFrame, ...symbolsBelow];
    });
  }

  /**
   * Проверяет соответствие количества рилов количеству конфигураций дополнительных символов.
   * @param {number} framesLength - Количество фреймов.
   * @throws {Error} Если количество конфигураций не совпадает с количеством фреймов.
   * @private
   */
  private lengthCheck(framesLength: number): void | never {
    const extraSymbolsLength = Object.keys(this.extraSymbols).length;
    if (extraSymbolsLength !== framesLength) {
      throw new Error(
        `The number of configured extra symbols (${extraSymbolsLength}) does not match the number of frames (${framesLength}).`
      );
    }
  }

  /**
   * Устанавливает новую конфигурацию для дополнительных символов.
   * @param {ExtraSymbolsConfig} extraSymbols - Новая конфигурация.
   */
  public setExtraSymbols(extraSymbols: ExtraSymbolsConfig) {
    this.extraSymbols = extraSymbols;
  }
}
