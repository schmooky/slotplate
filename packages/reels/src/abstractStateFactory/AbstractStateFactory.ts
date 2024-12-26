import { AbstractState } from "../abstractState/index.js";
import { Reel } from "./../reel/index.js";

/**
 * Абстрактный класс для создания состояний барабанов.
 * Предоставляет интерфейс для получения экземпляра состояния в зависимости от типа состояния.
 */
export abstract class AbstractStateFactory {
  /**
   * Возвращает экземпляр состояния для указанного барабана.
   *
   * @abstract
   * @param {Reel} reel - Барабан, для которого нужно получить состояние.
   * @param {string} stateType - Тип состояния, которое нужно создать.
   * @returns {AbstractState} Экземпляр состояния, соответствующий указанному типу.
   */
  abstract getState(reel: Reel, stateType: string): AbstractState;
}
