import { ProgressBar } from '@pixi/ui';
import { Container, ContainerChild, Graphics, Text, TextStyle } from 'pixi.js';

export class LoaderProgressBar extends Container {
  private readonly progressBar: ProgressBar;

  private readonly progressText: Text;

  constructor(progressContainer: Container<ContainerChild>, filler: Graphics, bg: Graphics, textStyle: TextStyle) {
    super();

    this.progressBar = new ProgressBar({
      bg,
      fill: filler,
      progress: 1,
    });

    this.progressText = new Text({ text: '', style: textStyle });
    this.progressText.anchor.set(0.5, 1);

    progressContainer.addChild(this.progressBar, this.progressText);

    this.addChild(progressContainer);

    this.onResize(document.body.clientHeight > document.body.clientWidth);
  }

  setProgress(progress: number) {
    this.progressBar.progress = Math.floor(progress * 100);
    this.progressText.text = `${this.progressBar.progress}%`;
  }

  onResize = (isPortrait: boolean) => {
    this.progressBar.scale.set(isPortrait ? 0.536 : 1, 1);
    this.progressText.position.set(this.progressBar.width / 2, -28);
  };
}
