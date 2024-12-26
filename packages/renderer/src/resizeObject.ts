export class WindowResize {
  width = document.body.clientWidth;

  height = document.body.clientHeight;

  isPortrait = document.body.clientHeight > document.body.clientWidth;

  aspectRatio =
    Math.max(document.body.clientWidth, document.body.clientHeight) /
    Math.min(document.body.clientWidth, document.body.clientHeight);

  constructor() {
    window.addEventListener("resize", this.setWindowSize);
    window.addEventListener("orientationchange", this.setWindowSize);
  }

  setWindowSize = () => {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.isPortrait = document.body.clientHeight > document.body.clientWidth;
    this.aspectRatio =
      Math.max(document.body.clientWidth, document.body.clientHeight) /
      Math.min(document.body.clientWidth, document.body.clientHeight);
  };
}

export const resizeObject = new WindowResize();
