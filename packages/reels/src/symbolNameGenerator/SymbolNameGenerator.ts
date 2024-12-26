import { ISymbolsData, SymbolGeneratorParams } from "../../types.js";

/**
 * Класс для генерации имен символов с учетом их весов и списков исключений.
 * Позволяет получать случайные символы для вращения рила, а также для символов, размещаемых выше/ниже.
 */
export class SymbolNameGenerator {
  /**
   * Массив накопленных весов символов.
   * Используется для бинарного поиска и быстрого определения выбранного символа.
   * @type {number[]}
   * @protected
   */
  protected cumulativeWeights: number[] = [];

  /**
   * Список всех доступных символов.
   * @type {string[]}
   * @protected
   */
  protected symbols: string[] = [];

  /**
   * Суммарный вес всех символов.
   * @type {number}
   * @protected
   */
  protected totalWeight: number = 0;

  /**
   * Данные о символах (их веса, свойства), мапа "имя символа" -> данные о нем.
   * @type {ISymbolsData}
   * @protected
   */
  protected symbolsData!: ISymbolsData;

  /**
   * Список символов, которые нужно исключить при генерации символов в режиме вращения.
   * @type {string[] | []}
   * @protected
   */
  protected excludeRotateSymbols: string[] | [] = [];

  /**
   * Список символов, которые нужно исключить при генерации символов выше/ниже.
   * @type {string[] | []}
   * @protected
   */
  protected excludeAboveBelowSymbols: string[] | [] = [];

  /**
   * Создает экземпляр SymbolNameGenerator.
   * @param {SymbolGeneratorParams} params Параметры для инициализации генератора.
   */
  constructor(params: SymbolGeneratorParams) {
    this.initialize(params);
  }

  /**
   * Инициализирует генератор, устанавливая данные о символах, списки исключений,
   * а также рассчитывает общие веса для всех символов.
   * @param {SymbolGeneratorParams} params Параметры инициализации.
   * @private
   */
  private initialize(params: SymbolGeneratorParams): void {
    this.symbolsData = params.symbolsData;
    this.excludeRotateSymbols = params.excludeRotateSymbols;
    this.excludeAboveBelowSymbols = params.excludeAboveBelowSymbols;
    this.symbols = Object.keys(this.symbolsData);
    this.calculateTotalWeights();
  }

  /**
   * Пересчитывает общие веса символов и формирует массив накопленных весов.
   * @private
   */
  private calculateTotalWeights() {
    this.cumulativeWeights = [];
    let sum = 0;
    for (const symbol of this.symbols) {
      sum += this.symbolsData[symbol]!.weight;
      this.cumulativeWeights.push(sum);
    }
    this.totalWeight = sum;
  }

  /**
   * Возвращает случайный символ на основе весов, учитывая список исключений.
   * @param {boolean} [useAboveBelow=false] Если true, используется список excludeAboveBelowSymbols,
   * иначе excludeRotateSymbols.
   * @returns {string} Выбранный символ.
   * @throws {Error} Если после исключения символов список пуст.
   */
  public getNext(useAboveBelow = false): string {
    const excludeList = useAboveBelow
      ? this.excludeAboveBelowSymbols
      : this.excludeRotateSymbols;

    let symbols = this.symbols;
    let cumulativeWeights = this.cumulativeWeights;
    let totalWeight = this.totalWeight;

    if (excludeList.length > 0) {
      const filteredData = this.getFilteredData(excludeList);
      symbols = filteredData.symbols;
      cumulativeWeights = filteredData.cumulativeWeights;
      totalWeight = filteredData.totalWeight;
    }

    if (symbols.length === 0) {
      throw new Error("Symbols are empty");
    }

    const rand = Math.random() * totalWeight;
    const index = this.binarySearch(cumulativeWeights, rand);
    return symbols[index]!;
  }

  /**
   * Устанавливает новый список символов, которые нужно исключать при вращении.
   * @param {string[] | []} excludeSymbols Список исключаемых символов.
   */
  public setExcludeRotateSymbols(excludeSymbols: string[] | []): void {
    this.excludeRotateSymbols = excludeSymbols;
  }

  /**
   * Устанавливает новый список символов, которые нужно исключать для символов выше/ниже.
   * @param {string[] | []} excludeSymbols Список исключаемых символов.
   */
  public setExcludeAboveBelowSymbols(excludeSymbols: string[] | []) {
    this.excludeAboveBelowSymbols = excludeSymbols;
  }

  /**
   * Фильтрует список символов, исключая указанные.
   * @param {string[]} excludeSymbols Список символов, которые нужно исключить.
   * @returns {{ symbols: string[], cumulativeWeights: number[], totalWeight: number }} Объект с обновленным списком символов, их накопленными весами и суммарным весом.
   * @protected
   */
  protected getFilteredData(excludeSymbols: string[]): {
    symbols: string[];
    cumulativeWeights: number[];
    totalWeight: number;
  } {
    const symbols: string[] = [];
    const cumulativeWeights: number[] = [];
    let sum = 0;

    for (let i = 0; i < this.symbols.length; i++) {
      const symbol = this.symbols[i]!;
      if (!excludeSymbols.includes(symbol)) {
        sum += this.symbolsData[symbol]!.weight;
        symbols.push(symbol);
        cumulativeWeights.push(sum);
      }
    }

    return { symbols, cumulativeWeights, totalWeight: sum };
  }

  /**
   * Выполняет бинарный поиск по массиву накопленных весов, чтобы определить индекс выбранного символа.
   * @param {number[]} array Массив накопленных весов.
   * @param {number} value Значение, для которого нужно найти позицию.
   * @returns {number} Индекс выбранного символа.
   * @protected
   */
  protected binarySearch(array: number[], value: number): number {
    let low = 0;
    let high = array.length - 1;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (value < array[mid]!) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    return low;
  }

  /**
   * Обновляет данные о символах и заново рассчитывает накопленные веса.
   * @param {ISymbolsData} updatedSymbolsData Обновленные данные о символах.
   */
  public updateWeights(updatedSymbolsData: ISymbolsData): void {
    this.symbolsData = updatedSymbolsData;
    this.calculateTotalWeights();
  }
}
