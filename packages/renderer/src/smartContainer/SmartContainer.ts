import { Container, DestroyOptions } from "pixi.js";
import { resizeObject } from "../resizeObject";

type LayoutData = {
  align?: "left" | "center" | "right";
  valign?: "top" | "center" | "bottom";
  width?: number;
  height?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  stretchWidth?: boolean;
  stretchHeight?: boolean;
  correctionScaleX?: number;
  correctionScaleY?: number;
  correctionOffsetX?: number;
  correctionOffsetY?: number;
  fitCover?: boolean;
};

type LayoutDataRequired = Required<LayoutData>;

interface SmartContainerArgs {
  portraitData?: LayoutData;
  landscapeData?: LayoutData;
  visible?: boolean;
}

export class SmartContainer extends Container {
  private readonly default: LayoutDataRequired = {
    align: "center",
    valign: "center",
    viewportWidth: 0,
    viewportHeight: 0,
    height: 0,
    width: 0,
    stretchWidth: false,
    stretchHeight: false,
    correctionScaleX: 1,
    correctionScaleY: 1,
    correctionOffsetX: 0,
    correctionOffsetY: 0,
    fitCover: false,
  };

  private readonly default_portrait: LayoutDataRequired = {
    ...this.default,
    viewportWidth: 1080,
    viewportHeight: 1920,
  };

  private readonly default_landscape: LayoutDataRequired = {
    ...this.default,
    viewportWidth: 1920,
    viewportHeight: 1080,
  };

  private wrapperdPortraitData?: LayoutData;

  private wrapperdLandscapeData?: LayoutData;

  private portraitUseData = this.default_portrait;

  private landscapeUseData = this.default_landscape;

  constructor(props: SmartContainerArgs = {}) {
    super();
    const { portraitData, landscapeData, visible = true } = props;
    this.wrapperdPortraitData = portraitData;
    this.wrapperdLandscapeData = landscapeData;
    this.portraitUseData = { ...this.default_portrait, ...portraitData };
    this.landscapeUseData = { ...this.default_landscape, ...landscapeData };
    this.visible = visible;

    window.addEventListener("resize", this.updateContainer);
    window.addEventListener("orientationchange", this.updateContainer);

    this.updateContainer();
  }

  updateContainer = () => {
    this.portraitUseData = {
      ...this.default_portrait,
      ...this.wrapperdPortraitData,
    };
    this.landscapeUseData = {
      ...this.default_landscape,
      ...this.wrapperdLandscapeData,
    };
    const { width: windowWidth, height: windowHeight } = resizeObject;
    const {
      align,
      valign,
      viewportHeight,
      viewportWidth,
      stretchWidth,
      stretchHeight,
      correctionScaleX,
      correctionScaleY,
      correctionOffsetX,
      correctionOffsetY,
      fitCover,
    } =
      windowHeight > windowWidth ? this.portraitUseData : this.landscapeUseData;

    const m = fitCover ? Math.max : Math.min;

    const scale = m(windowWidth / 1920, windowHeight / 1080);
    let { width, height } =
      windowHeight > windowWidth ? this.portraitUseData : this.landscapeUseData;

    let scaleX = scale;
    let scaleY = scale;

    if (viewportWidth || viewportWidth) {
      const scale = m(
        windowWidth / (viewportWidth || 1920),
        windowHeight / (viewportHeight || 1080),
      );

      scaleX = scale;
      scaleY = scale;
    }

    if (stretchWidth) {
      scaleX = windowWidth / width;
      width = windowWidth / scaleX;
    }

    if (stretchHeight) {
      scaleY = windowHeight / height;
      height = windowHeight / scaleY;
    }

    scaleX *= correctionScaleX;
    scaleY *= correctionScaleY;

    this.scale.set(scaleX, scaleY);

    let containerX = 0;
    let containerY = 0;

    if (align === "right") {
      containerX = windowWidth - width * scaleX;
    } else if (align === "center") {
      containerX = (windowWidth - width * scaleX) / 2;
    }

    if (valign === "bottom") {
      containerY = windowHeight - height * scaleY;
    } else if (valign === "center") {
      containerY = (windowHeight - height * scaleY) / 2;
    }

    this.x = containerX + correctionOffsetX * scaleX;
    this.y = containerY + correctionOffsetY * scaleY;
  };

  set portraitData(data: LayoutData) {
    this.wrapperdPortraitData = data;
    this.updateContainer();
  }

  set landscapeData(data: LayoutData) {
    this.wrapperdLandscapeData = data;
    this.updateContainer();
  }

  destroy(options?: DestroyOptions) {
    super.destroy(options);
    window.removeEventListener("resize", this.updateContainer);
    window.removeEventListener("orientationchange", this.updateContainer);
  }
}
