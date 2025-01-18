import { Container, ContainerChild } from 'pixi.js';

export interface Scene extends Container<ContainerChild> {
  onResize(): void;
}

export default class SceneManager extends Container {
  private scene!: Scene;

  constructor() {
    super();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
  }

  start(scene: Scene) {
    // destroy scene container and all children
    if (this.scene) {
      this.scene.destroy({ children: true });
    }

    this.scene = scene;
    this.addChild(this.scene);
  }

  onResize = () => {
    this.scene.onResize();
  };

  destroy() {
    window.removeEventListener('resize', this.onResize);
    super.destroy(true);
  }
}
