import { Container } from "pixi.js";
import { SimpleHandler } from "../../types.js";

/**
 * Абстрактный класс, представляющий символ барабана.
 *
 * @template ObjectType Тип объекта, представляющего символ (по умолчанию `Container`).
 */
export abstract class AbstractReelSymbol<
  ObjectType extends Container = Container,
> extends Container {
  /**
   * Объект, представляющий символ.
   * @type {ObjectType}
   */
  public symbol!: ObjectType;

  /**
   * Имя символа.
   * @type {string}
   */
  public symbolName!: string;

  /**
   * Устанавливает позицию символа на барабане.
   *
   * @param {number} x - Координата X.
   * @param {number} y - Координата Y.
   */
  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
  }

  /**
   * Воспроизводит анимацию символа.
   *
   * @abstract
   * @param {string} animationName - Имя анимации, которую нужно воспроизвести.
   * @param {SimpleHandler} [onComplete] - Колбэк, вызываемый по завершении анимации.
   */
  abstract playAnimation(
    animationName: string,
    onComplete?: SimpleHandler
  ): void;

  /**
   * Останавливает текущую анимацию символа.
   *
   * @abstract
   */
  abstract stopAnimation(): void;

  /**
   * Устанавливает объект символа и его имя.
   *
   * @abstract
   * @param {ObjectType} symbol - Объект, представляющий символ.
   * @param {string} symbolName - Имя символа.
   */
  abstract setSymbol(symbol: ObjectType, symbolName: string): void;
}
