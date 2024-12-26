import { Container, Text, TextStyle, Ticker } from 'pixi.js';
import { CircularProgressBar } from '@pixi/ui';
import gsap from 'gsap';

interface CircularProgressBarOptions {
  backgroundColor: number;
  backgroundAlpha: number;
  lineWidth: number;
  fillColor: number;
  fillAlpha: number;
  radius: number;
  value: number;
  cap: 'round' | 'butt' | 'square';
  initialTime: number;
  textStyle: TextStyle;
  onComplete: () => void;
}

export class CustomCircularProgressBar extends Container {
  private progressBar: CircularProgressBar;
  private centerText: Text;
  private remainingTime: number;
  private totalTime: number;
  public ticker: Ticker;
  private elapsedTime: number = 0;
  private onComplete?: () => void;
  private isActive: boolean = false;

  constructor(options: CircularProgressBarOptions) {
    super();

    this.totalTime = options.initialTime;
    this.remainingTime = this.totalTime;

    this.progressBar = new CircularProgressBar({
      backgroundColor: options.backgroundColor,
      backgroundAlpha: options.backgroundAlpha,
      lineWidth: options.lineWidth,
      fillColor: options.fillColor,
      fillAlpha: options.fillAlpha,
      radius: options.radius,
      value: 100,
      cap: options.cap,
    });

    this.centerText = new Text({
      text: `${this.remainingTime}`,
      style: options.textStyle,
    });
    this.centerText.anchor.set(0.5);

    this.addChild(this.progressBar);
    this.progressBar.addChild(this.centerText);

    this.alpha = 0;
    this.progressBar.fillCircle.scale.x = -1;
    this.centerText.position.set(2, 0);

    this.ticker = Ticker.shared;
    this.ticker.add(this.updateTime, this);

    this.onComplete = options.onComplete;
  }

  private updateTime() {
    if (!this.isActive) return;

    this.elapsedTime += this.ticker.deltaMS / 1000;

    if (this.elapsedTime >= 1) {
      this.elapsedTime = 0;
      this.remainingTime -= 1;

      if (this.remainingTime >= 0) {
        this.progressBar.progress = (this.remainingTime / this.totalTime) * 100;
        this.centerText.text = `${Math.ceil(this.remainingTime)}`;
      } else {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }
  }

  start() {
    gsap.killTweensOf(this);

    gsap.to(this, {
      alpha: 1,
      duration: 2,
    });
    this.isActive = true;
  }

  stop() {
    gsap.killTweensOf(this);

    this.isActive = false;
    gsap.to(this, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        this.reset();
      },
    });
  }

  reset() {
    this.remainingTime = this.totalTime;
    this.elapsedTime = 0;
    this.progressBar.progress = 100;
    this.centerText.text = `${Math.ceil(this.remainingTime)}`;
  }
}
