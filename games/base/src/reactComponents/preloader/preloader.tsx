import React, { useEffect } from 'react';
import { changeLogoScale } from '@src/reactComponents/preloader/changeLogoScale';
import GambitLogoMemo from '@src/reactComponents/preloader/logo';
import { PreloaderBg } from '@src/reactComponents/preloader/preloader.styled';

export const Preloader = () => {
  useEffect(() => {
    const htmlElement = document.querySelector('#logo');
    changeLogoScale(htmlElement as HTMLElement);

    const listener = changeLogoScale.bind(null, htmlElement as HTMLElement);

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return (
    <PreloaderBg>
      <GambitLogoMemo id={'logo'} />
    </PreloaderBg>
  );
};
