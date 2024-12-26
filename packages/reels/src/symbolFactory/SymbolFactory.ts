import { AbstractReelSymbol } from "../abstractReelSymbol/index.js";
import { ObjectPool } from "./../objectPool/index.js";
import { ReelsConfig } from "./../reelsConfig/index.js";
import { Position, SymbolFactoryParams, SymbolLink } from "../../types.js";

/**
 * Фабрика символов для барабанов.
 * Создает и настраивает символы для заданных барабанов.
 */
export class SymbolFactory {
  private objectPool: ObjectPool;
  protected reelsConfig: ReelsConfig;
  private readonly symbolLink: SymbolLink;

  /**
   * Создает экземпляр SymbolFactory.
   *
   * @param {SymbolFactoryParams} params - Параметры для инициализации фабрики символов.
   * @param {ObjectPool} params.objectPool - Пул объектов для управления символами.
   * @param {ReelsConfig} params.reelsConfig - Конфигурация барабанов.
   * @param {SymbolLink} params.symbolLink - Ссылка на класс символов.
   */
  constructor(params: SymbolFactoryParams) {
    this.objectPool = params.objectPool;
    this.reelsConfig = params.reelsConfig;
    this.symbolLink = params.symbolLink;
  }

  /**
   * Создает символ для заданного барабана.
   *
   * @param {string} symbolName - Имя создаваемого символа.
   * @param {number} reelIndex - Индекс барабана.
   * @param {number} row - Индекс строки на барабане.
   * @returns {AbstractReelSymbol} Созданный символ.
   */
  public create(
    symbolName: string,
    reelIndex: number,
    row: number
  ): AbstractReelSymbol {
    const symbol = this.createBaseSymbol(symbolName);
    const position = this.calculatePosition(reelIndex, row);
    this.applySymbolAttributes(symbol, position, reelIndex);
    return symbol;
  }

  /**
   * Создает базовый символ на основе имени.
   *
   * @private
   * @param {string} symbolName - Имя символа.
   * @returns {AbstractReelSymbol} Базовый символ.
   */
  private createBaseSymbol(symbolName: string): AbstractReelSymbol {
    const symbol = new this.symbolLink();
    const object = this.objectPool.getObject(symbolName);
    symbol.setSymbol(object, symbolName);
    return symbol;
  }

  /**
   * Вычисляет позицию символа на барабане.
   *
   * @private
   * @param {number} reelIndex - Индекс барабана.
   * @param {number} row - Индекс строки.
   * @returns {{ x: number; y: number }} Объект с координатами символа.
   */
  private calculatePosition(reelIndex: number, row: number): Position {
    const positionX = reelIndex * this.reelsConfig.getSymbolWidth(reelIndex);
    const positionY = row * this.reelsConfig.getSymbolHeight(reelIndex);
    return { x: positionX, y: positionY };
  }

  /**
   * Применяет атрибуты к символу, такие как позиция и масштаб.
   *
   * @private
   * @param {AbstractReelSymbol} symbol - Символ, к которому применяются атрибуты.
   * @param {{ x: number; y: number }} position - Позиция символа.
   * @param {number} reelIndex - Индекс барабана.
   */
  private applySymbolAttributes(
    symbol: AbstractReelSymbol,
    position: Position,
    reelIndex: number
  ): void {
    symbol.setPosition(position.x, position.y);
    symbol.scale.set(this.reelsConfig.reelsParameters.reelsScale[reelIndex]);
  }
}
