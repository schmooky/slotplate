import { AbstractReelSymbol } from "../abstractReelSymbol/index.js";
import { ReelsConfig } from "./../reelsConfig/index.js";

/**
 * Класс, отвечающий за перемещение символов на риле во время вращения.
 * Управляет смещением, перестановкой символов и выравниванием рила в конечной позиции.
 */
export class ReelMovementHandler {
  /**
   * Создает экземпляр ReelMovementHandler.
   * @param {ReelsConfig} reelsConfig Конфигурация рилов.
   * @param {number} reelIndex Индекс рила.
   * @param {number} symbolHeight Высота символа.
   * @param {AbstractReelSymbol[]} symbols Массив символов на риле.
   * @param {(symbol: AbstractReelSymbol, row: number) => void} updateSymbolCallback Функция обратного вызова для обновления символа.
   */
  constructor(
    protected reelsConfig: ReelsConfig,
    protected reelIndex: number,
    protected symbolHeight: number,
    protected symbols: AbstractReelSymbol[],
    protected updateSymbolCallback: (
      symbol: AbstractReelSymbol,
      row: number
    ) => void
  ) {}

  /**
   * Рассчитывает смещение по оси Y на основе скорости и дельты времени.
   * @param {number} symbolHeight Высота символа.
   * @param {number} currentSpeed Текущая скорость вращения.
   * @param {number} delay Дельта времени.
   * @returns {number} Рассчитанное смещение по Y.
   */
  public calcDeltaY(
    symbolHeight: number,
    currentSpeed: number,
    delay: number
  ): number {
    const maxDelta = symbolHeight / 2;
    return Math.min((symbolHeight * currentSpeed * delay) / 1000, maxDelta);
  }

  /**
   * Выполняет смещение символов на риле и, при необходимости, переставляет символы
   * @param {number} deltaY Смещение по оси Y.
   */
  public displacementSpinning(deltaY: number): void {
    if (deltaY !== 0) {
      this.symbols.forEach((symbol) => {
        symbol.y += deltaY;
      });
      this.rearrangement(deltaY > 0);
    }
  }

  /**
   * Выполняет однократный шаг вращения: обновляет каждый символ на один шаг по фрейму.
   */
  public oneStepSpinning(): void {
    for (let row = this.symbols.length - 1; row >= 0; row--) {
      const symbol = this.symbols[row];
      if (!symbol) {
        throw new Error(`Symbol at row ${row} is undefined.`);
      }
      this.updateSymbolCallback(symbol, row);
    }
  }

  /**
   * Выравнивает символы в корректные позиции по Y (используется, например, при остановке рила).
   */
  public setToCorrectPosition(): void {
    this.symbols.forEach((symbol: AbstractReelSymbol, row: number): void => {
      const targetY = row * this.symbolHeight;
      if (symbol.y !== targetY) {
        symbol.y = targetY;
      }
    });
  }

  /**
   * Проверяет направление смещения и вызывает соответствующую перестановку символов.
   * @param {boolean} isPositive true, если смещение положительное (вниз), иначе false (вверх).
   * @protected
   */
  protected rearrangement(isPositive: boolean): void {
    if (isPositive) {
      this.moveSymbolUp();
    } else {
      this.moveSymbolDown();
    }
  }

  /**
   * Перемещает символы вверх: нижний символ становится верхним.
   * @protected
   */
  protected moveSymbolUp(): void {
    const firstSymbol = this.symbols[0];
    const lastSymbol = this.symbols[this.symbols.length - 1];
    const maxPositionY = this.reelsConfig.getMaxPositionY(this.reelIndex);

    if (lastSymbol && firstSymbol && lastSymbol.y >= maxPositionY) {
      this.moveSymbol(lastSymbol, firstSymbol, true);
      this.symbols.pop();
      this.symbols.unshift(lastSymbol);
    }
  }

  /**
   * Перемещает символы вниз: верхний символ становится нижним.
   * @protected
   */
  protected moveSymbolDown(): void {
    const firstSymbol = this.symbols[0];
    const lastSymbol = this.symbols[this.symbols.length - 1];
    const minPositionY = this.reelsConfig.getMinPositionY(this.reelIndex);

    if (lastSymbol && firstSymbol && firstSymbol.y <= minPositionY) {
      this.moveSymbol(firstSymbol, lastSymbol, false);
      this.symbols.shift();
      this.symbols.push(firstSymbol);
    }
  }

  /**
   * Переставляет символ в новое положение, обновляя его координаты и вызывая колбэк обновления.
   * @param {AbstractReelSymbol} symbolToMove Символ, который нужно переместить.
   * @param {AbstractReelSymbol} referenceSymbol Опорный символ, относительно которого определяется новое положение.
   * @param {boolean} isPositive Направление движения (true - вверх, false - вниз).
   * @protected
   */
  protected moveSymbol(
    symbolToMove: AbstractReelSymbol,
    referenceSymbol: AbstractReelSymbol,
    isPositive: boolean
  ): void {
    const positionY = isPositive
      ? referenceSymbol.y - this.symbolHeight
      : referenceSymbol.y + this.symbolHeight;
    symbolToMove.y = positionY;
    this.updateSymbolCallback(
      symbolToMove,
      isPositive ? 0 : this.symbols.length - 1
    );
  }
}
