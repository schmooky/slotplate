import { AbstractReelSymbol } from "../abstractReelSymbol/index.js";
import { AbstractState } from "../abstractState/index.js";
import { ObjectPool } from "./../objectPool/index.js";
import { ReelsConfig } from "./../reelsConfig/index.js";
import { ReelsContainer } from "./../reelsContainer/index.js";
import { SymbolNameGenerator } from "./../symbolNameGenerator/index.js";
import { Nullable, ReelParameters, SpinningMode } from "../../types.js";
import { FrameHandler } from "./FrameHandler.js";
import { ReelMovementHandler } from "./ReelMovementHandler.js";

/**
 * Класс, представляющий один барабан (рил) в слоте.
 * Отвечает за управление символами, их обновление, обработку состояний и режимов вращения.
 */
export class Reel {
  /**
   * Конфигурация рилов.
   * @type {ReelsConfig}
   * @public
   */
  public reelsConfig!: ReelsConfig;

  /**
   * Пул объектов для переиспользования текстур и снижения нагрузки на GC.
   * @type {ObjectPool}
   * @protected
   */
  protected objectPool!: ObjectPool;

  /**
   * Контейнер, содержащий все рилы.
   * @type {ReelsContainer}
   * @protected
   */
  protected reelsContainer: ReelsContainer;

  /**
   * Генератор имен символов, учитывающий исключения и веса.
   * @type {SymbolNameGenerator}
   * @protected
   */
  protected randomSymbolGenerator: SymbolNameGenerator;

  /**
   * Массив символов, принадлежащих этому рилу.
   * @type {AbstractReelSymbol[]}
   * @public
   */
  public symbols!: AbstractReelSymbol[];

  /**
   * Обработчик фреймов, управляющий получением новых символов при остановке.
   * @type {FrameHandler}
   * @private
   */
  private frameHandler!: FrameHandler;

  /**
   * Контроллер движения рила, отвечающий за смещение символов, перестановку и позиционирование.
   * @type {ReelMovementController}
   * @private
   */
  private movementController!: ReelMovementHandler;

  /**
   * Индекс данного рила.
   * @type {number}
   * @public
   */
  public reelIndex!: number;

  /**
   * Функция обратного вызова для обработки каждого кадра анимации.
   * @type {Nullable<(dt: number) => void>}
   * @public
   */
  public tickHandler: Nullable<(dt: number) => void> = null;

  /**
   * Текущая скорость прогресса вращения рила.
   * @type {number}
   * @public
   */
  public progressSpeed: number = 0;

  /**
   * Режим вращения рила (например, бесконечный, по фреймам, однократный шаг).
   * @type {SpinningMode}
   * @protected
   */
  protected spinningMode: SpinningMode = SpinningMode.Infinite;

  /**
   * Текущее состояние рила (например, состояние вращения, остановки, ожидания).
   * @type {AbstractState | null}
   * @protected
   */
  protected state: AbstractState | null = null;

  /**
   * Высота символа, учитывая масштаб.
   * @type {number}
   * @private
   */
  private symbolHeight!: number;

  /**
   * Ширина символа, учитывая масштаб.
   * @type {number}
   * @private
   */
  private symbolWidth!: number;

  /**
   * Создает экземпляр рила.
   * @param {ReelParameters} parameters Параметры для инициализации рила.
   */
  constructor(parameters: ReelParameters) {
    this.initialize(parameters);
  }

  /**
   * Инициализирует рил, устанавливая свойства и создавая необходимые контроллеры.
   * @param {ReelParameters} parameters Параметры для инициализации рила.
   * @protected
   */
  protected initialize(parameters: ReelParameters) {
    this.initProperties(parameters);
    this.initHandlers();
    this.addSymbolsToContainer();
  }

  /**
   * Инициализирует основные свойства рила.
   * @param {ReelParameters} parameters Параметры рила.
   * @private
   */
  protected initProperties(parameters: ReelParameters): void {
    this.reelsConfig = parameters.reelsConfig;
    this.objectPool = parameters.objectPool;
    this.reelsContainer = parameters.reelsContainer;
    this.randomSymbolGenerator = parameters.randomSymbolGenerator;
    this.symbols = parameters.symbols;
    this.reelIndex = parameters.reelIndex;

    this.symbolHeight = this.reelsConfig.getSymbolHeight(this.reelIndex);
    this.symbolWidth = this.reelsConfig.getSymbolWidth(this.reelIndex);
  }

  /**
   * Инициализирует хэндлеры для фреймов и движений.
   * @private
   */
  protected initHandlers(): void {
    this.frameHandler = new FrameHandler();
    this.movementController = new ReelMovementHandler(
      this.reelsConfig,
      this.reelIndex,
      this.symbolHeight,
      this.symbols,
      (symbol, row) => this.updateSymbol(symbol, row)
    );
  }

  /**
   * Добавляет символы рила в соответствующий контейнер (маскированный или нет).
   * @private
   */
  protected addSymbolsToContainer(): void {
    this.symbols.forEach((symbol, row) => {
      this.addSymbolToContainer(symbol, row);
    });
  }

  /**
   * Добавляет конкретный символ в нужный контейнер: маскированный или немаскированный.
   * Перемещение символа в контейнер определяется видимостью и параметром `unMaskSymbol`.
   *
   * @param {AbstractReelSymbol} symbol - Символ, добавляемый в контейнер.
   * @param {number} row - Индекс строки символа на риле.
   * @throws {Error} Выбрасывается, если видимые индексы для текущего рила отсутствуют.
   * @throws {Error} Выбрасывается, если данные символа (`symbolData`) не найдены.
   * @throws {Error} Выбрасывается, если свойство `unMaskSymbol` отсутствует в данных символа.
   * @private
   */
  protected addSymbolToContainer(
    symbol: AbstractReelSymbol,
    row: number
  ): void {
    const visibleIndices =
      this.reelsConfig.reelsParameters.reelsVisibleIndices[this.reelIndex];

    if (!visibleIndices) {
      throw new Error(
        `Visible indices not found for reel index "${this.reelIndex}". Ensure the reel configuration is correct.`
      );
    }

    const isVisible = visibleIndices.includes(row);

    const symbolData =
      this.reelsConfig.symbolsParameters.symbolsData[symbol.symbolName];

    if (!symbolData) {
      throw new Error(
        `Symbol data not found for symbol name "${symbol.symbolName}". Check if the symbol is defined in the configuration.`
      );
    }

    const shouldUnmask = symbolData.unMaskSymbol;

    if (isVisible && shouldUnmask) {
      this.reelsContainer.unmaskedContainer.addChild(symbol);
    } else {
      this.reelsContainer.maskContainer.addChild(symbol);
    }
  }

  /**
   * Устанавливает фреймы, которые будут использоваться при остановке рила.
   * @param {string[]} frame Массив имен символов для остановки.
   */
  public setStopFrame(frame: string[]): void {
    this.frameHandler.setFrame(frame);
  }

  /**
   * Обработчик тикера, вызывается на каждый кадр.
   * @param {number} _ Время (не используется).
   * @param {number} dt Дельта времени между кадрами.
   */
  public onTick = (_: number, dt: number): void => {
    if (this.tickHandler) {
      this.tickHandler(dt);
    }
  };

  /**
   * Метод, вызываемый при вращении рила. Рассчитывает смещение и обновляет состояние.
   * @param {number} dt Дельта времени.
   */
  public spinning(dt: number): void {
    const deltaY = this.movementController.calcDeltaY(
      this.symbolHeight,
      this.progressSpeed,
      dt
    );
    this.processSpinningMode(deltaY);
  }

  /**
   * Устанавливает режим вращения рила (бесконечный, фреймовый, пошаговый).
   * @param {SpinningMode} mode Режим вращения.
   */
  public setSpinningMode(mode: SpinningMode): void {
    this.spinningMode = mode;
  }

  /**
   * Обрабатывает смещение символов в зависимости от текущего режима вращения.
   * @param {number} deltaY Смещение по оси Y.
   * @private
   * @throws {Error} Если режим вращения не поддерживается.
   */
  protected processSpinningMode(deltaY: number): void | never {
    switch (this.spinningMode) {
      case SpinningMode.Infinite:
      case SpinningMode.Frame:
        this.movementController.displacementSpinning(deltaY);
        break;
      case SpinningMode.FrameOneStep:
        this.movementController.oneStepSpinning();
        break;
      default:
        throw new Error(`Unsupported mode: ${this.spinningMode}`);
    }
  }

  /**
   * Устанавливает символы в корректные позиции (например, после остановки).
   */
  public setToCorrectPosition(): void {
    this.movementController.setToCorrectPosition();
  }

  /**
   * Обновляет символ в указанной позиции при необходимости.
   * @param {AbstractReelSymbol} symbolContainer Контейнер символа.
   * @param {number} row Индекс позиции символа.
   * @protected
   */
  protected updateSymbol(
    symbolContainer: AbstractReelSymbol,
    row: number
  ): void {
    const newSymbolName = this.getNewSymbolName();
    const currentSymbolName = symbolContainer.symbolName;
    if (newSymbolName !== currentSymbolName) {
      this.objectPool.returnObject(currentSymbolName, symbolContainer.symbol);
      const texture = this.objectPool.getObject(newSymbolName);

      symbolContainer.setSymbol(texture, newSymbolName);
      this.updateSymbolZIndex(row);
    }
  }

  /**
   * Определяет имя нового символа в зависимости от режима вращения.
   * @returns {string} Имя нового символа.
   * @protected
   * @throws {Error} Если режим вращения некорректен.
   */
  protected getNewSymbolName(): string {
    switch (this.spinningMode) {
      case SpinningMode.Infinite:
        return this.randomSymbolGenerator.getNext();
      case SpinningMode.Frame:
      case SpinningMode.FrameOneStep:
        return this.frameHandler.getNextSymbol();
      default:
        throw new Error("Invalid spinning mode");
    }
  }

  /**
   * Возвращает оставшееся количество символов до полной остановки рила.
   * @type {number}
   * @public
   * @readonly
   */
  public get offsetToStop(): number {
    return this.frameHandler.getOffsetToStop();
  }

  /**
   * Устанавливает маску для символов, которые должны быть спрятаны или показаны.
   * Перемещает символы в маскированный или немаскированный контейнер на основе их конфигурации.
   *
   * @param {boolean} isMasked - Если true, символы перемещаются в маскированный контейнер;
   *                              если false, в немаскированный контейнер.
   *
   * @throws {Error} Выбрасывается, если данные для символа (`symbolData`) не найдены в конфигурации.
   * @throws {Error} Выбрасывается, если видимые индексы (`visibleIndices`) для текущего рила отсутствуют.
   */
  public setIsMasked(isMasked: boolean) {
    this.symbols.forEach((symbol: AbstractReelSymbol, row: number): void => {
      const symbolData =
        this.reelsConfig.symbolsParameters.symbolsData[symbol.symbolName];
      const visibleIndices =
        this.reelsConfig.reelsParameters.reelsVisibleIndices[this.reelIndex];

      if (!symbolData) {
        throw new Error(
          `Данные символа не найдены для имени "${symbol.symbolName}". Убедитесь, что символ указан в конфигурации.`
        );
      }

      if (!visibleIndices) {
        throw new Error(
          `Видимые индексы не найдены для рила с индексом "${this.reelIndex}". Проверьте правильность настройки конфигурации рила.`
        );
      }

      if (symbolData.unMaskSymbol && visibleIndices.includes(row)) {
        if (isMasked) {
          this.reelsContainer.maskContainer.addChild(symbol);
        } else {
          this.reelsContainer.unmaskedContainer.addChild(symbol);
        }
      }
    });
  }

  /**
   * Обновляет z-index символа для корректного отображения в контейнере.
   * Расчет производится на основе данных символа и текущего рила.
   *
   * @param {number} row - Индекс позиции символа в риле.
   * @throws {Error} Выбрасывается, если символ не найден по указанному индексу `row`.
   * @protected
   */
  protected updateSymbolZIndex(row: number): void {
    const symbol = this.symbols[row];
    if (!symbol) throw new Error(`Symbol not found at rows ${row}`);
    const symbolData =
      this.reelsConfig.symbolsParameters.symbolsData[symbol.symbolName];
    const zIndex = symbolData?.zIndex ?? 1;
    symbol.zIndex =
      zIndex *
      (this.reelIndex * this.reelsConfig.reelsParameters.reelsQuantity + row);
  }

  /**
   * Запускает анимацию для всех символов на риле.
   * @param {string} animationName Имя анимации.
   */
  public setAllSymbolsAnimation(animationName: string): void {
    this.symbols.forEach((symbol) => {
      symbol.playAnimation(animationName);
    });
  }

  /**
   * Устанавливает новое состояние для рила и выполняет его логику.
   * @template ConfigType Тип конфигурации для состояния.
   * @param {AbstractState<ConfigType>} state Экземпляр состояния.
   * @param {ConfigType} config Конфигурация для состояния.
   * @returns {Promise<void>} Промис, разрешающийся после завершения логики состояния.
   */
  public async setReelState<ConfigType>(
    state: AbstractState<ConfigType>,
    config: ConfigType
  ): Promise<void> {
    this.state = state;
    try {
      await state.execute(config);
    } catch (error) {
      console.error("State execution failed:", error);
    } finally {
      this.state = null;
    }
  }

  /**
   * Останавливает текущее состояние рила, если оно существует.
   */
  public stopState(): void {
    if (this.state) {
      this.state.stopState();
      this.state = null;
    }
  }

  /**
   * Очищает обработчик анимации (тикер), если он был установлен.
   */
  public clearAnimationHandler(): void {
    if (this.tickHandler) this.tickHandler = null;
  }
}
