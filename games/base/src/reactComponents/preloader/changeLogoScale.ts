const scaleLogo = {
  mobile: [1, 1.5],
  tablet: [1.5, 2],
  desktop: [2, 2.5],
};

const viewPorts = {
  mobilePortrait: [320, 700],
  mobileLandscape: [600, 1024],

  tabletPortrait: [700, 1400],
  tabletLandscape: [1024, 1400],

  desktopPortrait: [1400, 2160],
  desktopLandscape: [1400, 3840],
};

export const changeLogoScale = (htmlElement: Element): void => {
  let portraitViewport;
  let landscapeViewport;
  let scaleArray;
  let scale;

  const isPortrait = document.body.clientHeight > document.body.clientWidth;

  if (!isPortrait && (document.body.clientWidth < 600 || document.body.clientWidth / document.body.clientHeight > 3)) {
    scale = '1.5';
  } else {
    const isMobile = isPortrait
      ? document.body.clientWidth < viewPorts.mobilePortrait[1]
      : document.body.clientWidth < viewPorts.mobileLandscape[1];

    const isTablet = isPortrait
      ? document.body.clientWidth < viewPorts.tabletPortrait[1]
      : document.body.clientWidth < viewPorts.tabletLandscape[1];

    if (isMobile) {
      portraitViewport = viewPorts.mobilePortrait;
      landscapeViewport = viewPorts.mobileLandscape;
      scaleArray = scaleLogo.mobile;
    } else if (isTablet) {
      portraitViewport = viewPorts.tabletPortrait;
      landscapeViewport = viewPorts.tabletLandscape;
      scaleArray = scaleLogo.tablet;
    } else {
      portraitViewport = viewPorts.desktopPortrait;
      landscapeViewport = viewPorts.desktopLandscape;
      scaleArray = scaleLogo.desktop;
    }

    let minScreenSize;
    let maxScreenSize;

    if (document.body.clientHeight > document.body.clientWidth) {
      [minScreenSize, maxScreenSize] = portraitViewport;
    } else {
      [minScreenSize, maxScreenSize] = landscapeViewport;
    }

    scale = `${
      scaleArray[0] +
      Math.sin((((document.body.clientWidth - minScreenSize) / (maxScreenSize - minScreenSize)) * Math.PI) / 2) *
        (scaleArray[1] - scaleArray[0])
    }`;
  }

  htmlElement.style.transform = `scale(${scale})`;
};
