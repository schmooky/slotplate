import { Container } from "pixi.js";
import { ObjectPoolParameters } from "../../types.js";

/**
 * Класс, реализующий пул объектов для переиспользования ресурсов (например, текстур),
 * чтобы уменьшить нагрузку на создание/уничтожение объектов.
 * @template TextureType Тип объектов в пуле, наследуемых от Container.
 */
export class ObjectPool<TextureType extends Container = Container> {
  /**
   * Хранилище объектов, организованных по имени символа.
   * @type {Record<string, TextureType[]>}
   * @public
   * @readonly
   */
  public readonly pool: Record<string, TextureType[]>;

  /**
   * Максимальное количество объектов одного типа в пуле.
   * @type {number}
   * @protected
   */
  protected maxTexturesPerSymbol: number;

  /**
   * Функция для создания нового объекта, если в пуле нет доступных.
   * @type {(objectName: string) => TextureType}
   * @protected
   */
  protected createTexture: (objectName: string) => TextureType;

  /**
   * Создает экземпляр ObjectPool.
   * @param {ObjectPoolParameters<TextureType>} params - Параметры для инициализации пула.
   */
  constructor(params: ObjectPoolParameters<TextureType>) {
    this.maxTexturesPerSymbol = params.maxTexturesPerSymbol;
    this.createTexture = params.createTexture;
    this.pool = {} as Record<string, TextureType[]>;
  }

  /**
   * Возвращает объект обратно в пул.
   * @param {string} symbolName - Имя символа или типа объекта.
   * @param {TextureType} texture - Объект, который нужно вернуть.
   */
  public returnObject(symbolName: string, texture: TextureType): void {
    if (!this.pool[symbolName]) {
      this.pool[symbolName] = [];
    }

    if (this.pool[symbolName]!.length < this.maxTexturesPerSymbol) {
      this.pool[symbolName]!.push(texture);
    }
  }

  /**
   * Получает объект из пула. Если объектов нет, создаёт новый.
   * @param {string} symbolName - Имя символа.
   * @returns {TextureType} Объект из пула (либо новый, если пул пуст).
   */
  public getObject(symbolName: string): TextureType {
    if (this.pool[symbolName] && this.pool[symbolName]!.length > 0) {
      return this.pool[symbolName]!.pop()!;
    } else {
      return this.createTexture(symbolName);
    }
  }

  /**
   * Возвращает количество доступных объектов указанного типа в пуле.
   * @param {string} symbolName - Имя символа или типа объекта.
   * @returns {number} Количество доступных объектов.
   */
  public size(symbolName: string): number {
    if (this.pool[symbolName]) {
      return this.pool[symbolName]!.length;
    } else {
      return 0;
    }
  }
}
