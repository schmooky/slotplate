/**
 * Класс для управления фреймами остановки рила.
 * Он хранит список символов, которые должны остановиться на риле, и управляет их выдачей.
 */
export class FrameHandler {
  /**
   * Текущий набор символов для остановки.
   * @type {string[]}
   * @private
   */
  private frame: string[] = [];

  /**
   * Счетчик оставшихся фреймов до полной остановки.
   * @type {number}
   * @private
   */
  private offsetToStop = 0;

  /**
   * Устанавливает фреймы, которые будут использоваться при остановке рила.
   * @param {string[]} frame Массив имен символов.
   */
  public setFrame(frame: string[]): void {
    this.frame = [...frame];
    this.offsetToStop = this.frame.length;
  }

  /**
   * Возвращает следующий символ из фрейма. По мере выдачи символов offsetToStop уменьшается.
   * @returns {string} Следующий фрейм из набора.
   * @throws {Error} Если нет доступных символов.
   */
  public getNextSymbol(): string | never {
    if (this.hasSymbols()) {
      this.offsetToStop--;
      return this.frame.pop()!;
    } else {
      throw new Error('Frame is empty');
    }
  }

  /**
   * Проверяет, остались ли символы в фрейме.
   * @returns {boolean} true, если символы еще есть, иначе false.
   */
  public hasSymbols(): boolean {
    return this.frame.length > 0;
  }

  /**
   * Возвращает количество оставшихся фреймов до полной остановки.
   * @returns {number} Количество символов, оставшихся для выдачи.
   */
  public getOffsetToStop(): number {
    return this.offsetToStop;
  }
}
