import { Container } from "pixi.js";
import { ContainerParameters, MaskParameters } from "../../types.js";

/**
 * Класс контейнер рилов. Управляет позиционированием,
 * маскированными и немаскированными контейнерами, а также установкой маски.
 */
export class ReelsContainer extends Container {
  /**
   * Контейнер с маской, содержащий часть символов.
   * @type {Container}
   * @public
   */
  public maskContainer!: Container;

  /**
   * Контейнер без маски, содержащий символы, которые не должны быть замаскированы.
   * @type {Container}
   * @public
   */
  public unmaskedContainer!: Container;

  /**
   * Создает экземпляр ReelsContainer.
   * @param {ContainerParameters} containerParameters Параметры для позиционирования контейнера.
   */
  constructor(protected containerParameters: ContainerParameters) {
    super();
    this.initialize();
  }

  /**
   * Инициализирует контейнер, создавая маскированный и немаскированный контейнеры.
   * @protected
   */
  protected initialize(): void {
    const { position } = this.containerParameters;

    this.x = position.x;
    this.y = position.y;

    this.maskContainer = new Container();
    this.maskContainer.sortableChildren = true;

    this.unmaskedContainer = new Container();
    this.unmaskedContainer.sortableChildren = true;

    this.addChild(this.maskContainer);
    this.addChild(this.unmaskedContainer);

    this.sortableChildren = true;
  }

  /**
   * Устанавливает маску для рилов.
   * @param {MaskParameters} maskParameters Параметры маски, включая саму маску и ее позицию.
   */
  public setContainerMask(maskParameters: MaskParameters) {
    this.addChild(maskParameters.mask);
    this.maskContainer.mask = maskParameters.mask;
    this.maskContainer.mask.x = maskParameters.position.x;
    this.maskContainer.mask.y = maskParameters.position.y;
  }
}
