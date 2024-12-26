import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { CircularProgressBar } from '@pixi/ui';

export class SoundLoader extends SmartContainer {
  public circularProgress = new CircularProgressBar({
    backgroundColor: 0x676666,
    backgroundAlpha: 1,
    lineWidth: 10,
    fillColor: 0xffffff,
    fillAlpha: 1,
    radius: 25,
    value: 10,
    cap: 'butt',
  });

  constructor() {
    super({
      landscapeData: {
        valign: 'top',
        align: 'left',
        viewportHeight: 1920,
        viewportWidth: 1080,
        correctionOffsetY: 115,
        correctionOffsetX: 320,
      },
      portraitData: {
        valign: 'top',
        align: 'left',
        viewportHeight: 1080,
        viewportWidth: 1920,
        correctionOffsetX: 300,
        correctionOffsetY: 125,
      },
    });

    this.addChild(this.circularProgress);

    this.startAnimation();
  }

  private startAnimation(): void {
    const animate = () => {
      this.updateProgress();
      requestAnimationFrame(animate);
      if (this.circularProgress.progress < 95) this.circularProgress.progress += 0.05;
    };

    animate();
  }

  private updateProgress(): void {
    this.circularProgress.rotation += 0.05;
  }

  onResize(): void {
    this.circularProgress.scale.set(resizeObject.isPortrait ? 0.75 : 1);
  }
}
