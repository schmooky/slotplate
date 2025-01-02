//                min / max
const htmlFs = {
  mobile: [12, 15],
  tablet: [19, 24],
  desktop: [24, 45],
};

const viewPorts = {
  mobilePortrait: [320, 700],
  mobileLandscape: [600, 1024],

  tabletPortrait: [700, 1400],
  tabletLandscape: [1024, 1400],

  desktopPortrait: [1400, 2160],
  desktopLandscape: [1400, 3840],
};

export const changeHtmlFontSize = (htmlElement: HTMLHtmlElement): void => {
  let portraitViewport;
  let landscapeViewport;
  let htmlFsArray;
  let fontSize;

  const isPortrait = document.body.clientHeight > document.body.clientWidth;

  if (
    !isPortrait &&
    (document.body.clientWidth < 600 || document.body.clientWidth / document.body.clientHeight > 3)
  ) {
    fontSize = '10px';
  } else {
    const isMobile = isPortrait
      ? document.body.clientWidth < (viewPorts.mobilePortrait[1] || 0)
      : document.body.clientWidth < (viewPorts.mobileLandscape[1] || 0);

    const isTablet = isPortrait
      ? document.body.clientWidth < (viewPorts.tabletPortrait[1] || 0)
      : document.body.clientWidth < (viewPorts.tabletLandscape[1] || 0);

    if (isMobile) {
      portraitViewport = viewPorts.mobilePortrait;
      landscapeViewport = viewPorts.mobileLandscape;
      htmlFsArray = htmlFs.mobile;
    } else if (isTablet) {
      portraitViewport = viewPorts.tabletPortrait;
      landscapeViewport = viewPorts.tabletLandscape;
      htmlFsArray = htmlFs.tablet;
    } else {
      portraitViewport = viewPorts.desktopPortrait;
      landscapeViewport = viewPorts.desktopLandscape;
      htmlFsArray = htmlFs.desktop;
    }

    let minScreenSize = 0;
    let maxScreenSize = 0;

    if (document.body.clientHeight > document.body.clientWidth) {
      minScreenSize = (portraitViewport[0] || 0);
      maxScreenSize = (portraitViewport[1] || 0);
    } else {
      minScreenSize = (landscapeViewport[0] || 0);
      maxScreenSize = (landscapeViewport[1] || 0);
    }

    fontSize = `${
        (htmlFsArray[0] || 0) +
      Math.sin(
        (((document.body.clientWidth - minScreenSize) / (maxScreenSize - minScreenSize)) *
          Math.PI) /
          2,
      ) *
        ((htmlFsArray[1] || 0) - (htmlFsArray[0] || 0))
    }px`;
  }

  htmlElement.style.fontSize = fontSize;
};
