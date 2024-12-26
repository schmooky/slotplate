import { Reel } from "./../reel/index.js";

/**
 * Базовый абстрактный класс для реализации различных состояний рила.
 * @template TConfig Тип конфигурации состояния.
 */
export abstract class AbstractState<TConfig = unknown> {
  /**
   * Индекс текущего рила.
   * @type {number}
   * @protected
   * @readonly
   */
  protected readonly reelIndex: number;

  /**
   * Создает экземпляр BaseStateAbstract.
   * @param {Reel} reel - Экземпляр рила, к которому применяется состояние.
   * @param {boolean} isSkippable - Флаг, указывающий, можно ли пропустить состояние.
   */
  constructor(
    protected reel: Reel,
    protected readonly isSkippable: boolean
  ) {
    this.reelIndex = this.reel.reelIndex;
    this.isSkippable = isSkippable;
  }

  /**
   * Выполняет основную логику состояния.
   * @param {TConfig} config - Конфигурация для состояния.
   * @returns {Promise<void>} Промис, который разрешается после завершения логики.
   * @abstract
   */
  public abstract execute(config: TConfig): Promise<void>;

  /**
   * Останавливает состояние.
   * @abstract
   */
  public abstract stopState(): void;

  /**
   * Проверяет, можно ли пропустить текущее состояние.
   * @returns {boolean} Возвращает `true`, если состояние можно пропустить, иначе `false`.
   */
  public canSkip(): boolean {
    return this.isSkippable;
  }
}
